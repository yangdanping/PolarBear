import doubanRequest, { locationRequest } from './index';
import useToast from '../utils/useToast';


export function getTVData(data) {
  return doubanRequest.get(`/search_subjects?type=tv`, data);
}