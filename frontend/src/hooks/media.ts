import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export function useIsMobile() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('xs'));
}

export function useIsTablet() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
}
