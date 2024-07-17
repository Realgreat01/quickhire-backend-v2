import { DateTime } from 'luxon';
import { Job } from '@hokify/agenda';
import { CommunityMessage, CommunitySchema } from '../../models';

const UPDATE_GROUP_ADMINS_FOR_COMMUNITIES = async (job: Job) => {
  try {
    const startOfWeek = DateTime.now().set({ weekday: 1, hour: 0, minute: 0, second: 0, millisecond: 0 });
    const endOfWeek = DateTime.now().set({ weekday: 7, hour: 23, minute: 59, second: 59, millisecond: 999 });

    const messages = await CommunityMessage.find({
      createdAt: { $gte: startOfWeek.toISO(), $lte: endOfWeek.toISO() },
    }).select('sender receiver');

    const groupedData = {};
    // Group and count messages by receiver and sender
    messages.forEach((message) => {
      const receiver = message.receiver.toString();
      if (!groupedData[receiver]) {
        groupedData[receiver] = {};
      }
      const sender = message.sender.toString();
      if (!groupedData[receiver][sender]) {
        groupedData[receiver][sender] = 0;
      }
      groupedData[receiver][sender] += 1;
    });

    // Get top senders for each receiver group
    const groupIds = Object.keys(groupedData);
    for (const groupId of groupIds) {
      const group = await CommunitySchema.findById(groupId).select('community_members');
      if (!group) continue;

      const groupMembers = group.community_members.toString();
      const sortedSenders = Object.keys(groupedData[groupId]).sort(
        (a, b) => groupedData[groupId][b] - groupedData[groupId][a],
      );

      const topSenders = sortedSenders.filter((sender) => groupMembers.includes(sender)).slice(0, 2);
      groupedData[groupId] = topSenders;
      await CommunitySchema.findByIdAndUpdate(groupId, { $set: { community_admins: topSenders } });
    }
    //     job.priority(1);
    //     job.repeatEvery('59 23 * * 0',  {
    //     skipImmediate: true
    // });
  } catch (error) {
    throw new Error();
  }
};

export { UPDATE_GROUP_ADMINS_FOR_COMMUNITIES };
