const errorHandler = (error: any) => {
  const userValidationError = error.message.toLowerCase().includes('validation');
  const BSONTypeError = error.message.includes('BSONTypeError');
  const duplicateError = error.code === 11000;

  if (userValidationError && BSONTypeError === false) {
    const errors = Object.values(error.errors).map((err: any) => {
      const errorObject = {};
      // Validation Errors
      if (err.properties && !err.message.includes('enum')) {
        const { path, message } = err.properties;

        errorObject[path] = message;
      }
      // Cast Errors
      if (err.name.includes('CastError')) {
        const { path, kind } = err;
        errorObject[path] = 'Please enter a valid ' + kind;
      }
      // Enum Errors
      if (err.message.includes('enum')) {
        const { path, properties, value } = err;

        errorObject[path] = path + ' can only be among ' + properties.enumValues.join(', ');
      }

      // Return stsartment
      return errorObject;
    });
    // returned  Error Object;
    const err = Object.assign({}, ...errors);

    return Object.assign({ message: 'VALIDATION ERROR', errors: err });
  }

  // Invalid  Mongoose Object ID Error
  if (BSONTypeError) {
    return { error: 'Selected content has been modified' };
  }

  // duplicate Key Error
  if (duplicateError) {
    const duplicateKey = Object.keys(error.keyValue);
    const errorObject = {};

    errorObject[duplicateKey[0]] =
      duplicateKey[0].replaceAll('_', ' ') +
      ' already exists, use a new ' +
      duplicateKey[0].replaceAll('_', ' ');
    return { code: 11000, message: 'DUPLICATE ERROR', error: errorObject };
  }
  return { error: { message: error?.message } };
};

export default errorHandler;
