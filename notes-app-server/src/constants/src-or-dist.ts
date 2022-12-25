export const srcOrDist = ['development', 'production'].includes(
  process.env.NODE_ENV,
)
  ? 'dist'
  : 'src';
