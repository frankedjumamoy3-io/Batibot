export function createKindergartenPlayActionGetter<TPlayAction extends string>(
  playAction: TPlayAction
) {
  return () => playAction;
}
