import useHashParam from 'use-hash-param';

export function useObjectHashParam<T extends object>(
  key: string,
  defaultValue: object,
) {
  const [state, _setState] = useHashParam(key, JSON.stringify(defaultValue));
  const setState = (value: T) => {
    _setState(JSON.stringify(value));
  };
  return [JSON.parse(state), setState] as [T, typeof setState];
}
