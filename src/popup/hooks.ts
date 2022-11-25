import useHashParam from 'use-hash-param';

const serialize = JSON.stringify;
const deserialize = JSON.parse;

// TODO:
//  - 描画のたびに JSON.parse が走ってるのはどうなのさ
export function useObjectHashParam<T extends object>(
  key: string,
  initialState: object,
) {
  const [stringState, setStringState] = useHashParam(
    key,
    serialize(initialState),
  );
  const setObjectState = (objectState: T | ((prev: T) => T)) => {
    if (typeof objectState === 'function') {
      setStringState((prev) =>
        serialize(objectState(deserialize(prev || '{}'))),
      );
    } else {
      setStringState(serialize(objectState));
    }
  };
  return [deserialize(stringState), setObjectState] as [
    T,
    typeof setObjectState,
  ];
}
