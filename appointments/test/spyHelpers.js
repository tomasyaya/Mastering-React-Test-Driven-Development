export const fetchResponseOk = (body) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  });

export const fetchResponseError = () => Promise.resolve({ ok: false });

// const spy = () => {
//   let receivedArguments;
//   let returnValues;
//   return {
//     fn: (...args) => {
//       receivedArguments = args;
//       return returnValues;
//     },
//     receivedArguments: () => receivedArguments,
//     receivedArgument: (n) => receivedArguments[n],
//     stubReturnValue: (value) => (returnValues = value),
//   };
// };
