import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 300, // 5 menit
});

export default cache;