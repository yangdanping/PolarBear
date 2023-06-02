export default function useToast(title, duration = 1500) {
  return wx.showToast({
    title,
    duration,
    icon: 'none'
  });
}
