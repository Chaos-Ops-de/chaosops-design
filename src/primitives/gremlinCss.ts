// Pure CSS, no framework imports — kept in its own module so DOM-only
// consumers (e.g. web/SentryErrorBoundary) can use the same animation
// classes as the React Native <Gremlin /> primitive without pulling in
// react-native.
export const gremlinCss = `
@keyframes chaos-gremlin-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes chaos-gremlin-wiggle { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
@keyframes chaos-gremlin-float  { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-6px) rotate(2deg); } }
.chaos-gremlin--bounce { animation: chaos-gremlin-bounce 1.8s ease-in-out infinite; }
.chaos-gremlin--wiggle { animation: chaos-gremlin-wiggle 1.2s ease-in-out infinite; transform-origin: 50% 80%; }
.chaos-gremlin--float  { animation: chaos-gremlin-float 2.4s ease-in-out infinite; }
`.trim();
