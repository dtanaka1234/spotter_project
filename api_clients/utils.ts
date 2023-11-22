export const getHostUrlIfNode = () => {
  if (typeof window === 'undefined') {
    return process.env.HOST_URL;
  }

  return '';
}