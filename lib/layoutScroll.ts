import {
  NativeScrollEvent,
  NativeScrollPoint,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";

let _node: ScrollView | null = null;
let _requestScrollToEndAnimated = false;
let _scrollPoint: NativeScrollPoint | null = null;
const _scrollPoints = new Map<string, NativeScrollPoint>();

function onRef(node: ScrollView | null) {
  _node = node;
}

function requestScrollToEndAnimated() {
  _requestScrollToEndAnimated = true;
}

function scrollToEndAnimatedIfRequested() {
  if (!_requestScrollToEndAnimated) return;
  _requestScrollToEndAnimated = false;
  _node?.scrollToEnd({ animated: true });
}

function onScroll({
  nativeEvent: { contentOffset },
}: NativeSyntheticEvent<NativeScrollEvent>) {
  _scrollPoint = { x: contentOffset.x, y: contentOffset.y };
}

function storeScroll(id: string) {
  if (_scrollPoint) _scrollPoints.set(id, _scrollPoint);
}

function restoreScroll(id: string) {
  const scrollPoint = _scrollPoints.get(id);
  if (scrollPoint) _node?.scrollTo({ ...scrollPoint, animated: false });
}

export const layoutScroll = {
  onRef,
  requestScrollToEndAnimated,
  scrollToEndAnimatedIfRequested,
  onScroll,
  storeScroll,
  restoreScroll,
};
