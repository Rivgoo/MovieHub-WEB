import { Theme, SxProps } from '@mui/material/styles';

export const getSeatDynamicStyles = (
  theme: Theme,
  isBooked?: boolean,
  isSelected?: boolean
): SxProps<Theme> => {
  const getSeatColor = (): string => {
    if (isBooked) return '#893f14';
    if (isSelected) return theme.palette.primary.main;
    return '#f1eae3';
  };

  const getSeatHoverColor = (): string => {
    if (isSelected) return theme.palette.primary.dark;
    return theme.palette.primary.light;
  };

  const getSeatTextColor = (): string => {
    if (isSelected || isBooked) return theme.palette.text.primary;

    return theme.palette.text.secondary;
  };

  return {
    minWidth: { xs: '26px', sm: '32px', md: '36px' },
    width: { xs: '26px', sm: '32px', md: '36px' },
    height: { xs: '26px', sm: '32px', md: '36px' },
    p: 0,
    m: { xs: '1px', sm: '2px' },
    fontSize: { xs: '0.65rem', sm: '0.75rem' },
    color: getSeatTextColor(),
    backgroundColor: getSeatColor(),
    border: `1px solid ${isSelected ? theme.palette.common.white : 'transparent'}`,
    boxShadow: isSelected ? `0 0 8px ${theme.palette.primary.main}` : 'none',
    '&:hover': {
      backgroundColor: getSeatHoverColor(),
      borderColor: isBooked ? 'transparent' : '#f1eae3',
      color: isSelected
        ? theme.palette.text.primary
        : theme.palette.text.secondary,
    },
    '&.Mui-disabled': {
      backgroundColor: '#893f14',
      color: theme.palette.text.primary,
      border: 'none',
    },
  };
};

export const getLegendColorBoxStyles = (color: string): SxProps<Theme> => ({
  width: 18,
  height: 18,
  bgcolor: color,
  mr: 0.5,
  borderRadius: '4px',
});

export const getBookingSeatPageStaticStyles = (
  theme: Theme
): Record<string, SxProps<Theme>> => ({
  pageContainer: {
    py: { xs: 1, md: 3 },
  },
  mainPaper: {
    p: { xs: 1, md: 3 },
    backgroundColor: 'background.paper',
  },
  pageTitle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'primary.secondary',
    fontWeight: 700,
    textAlign: 'center',
    mb: 3,
    mt: 1,
    '& .MuiSvgIcon-root': {
      mr: 1,
    },
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  infoPanelGridItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoPanelPaper: {
    p: 2,
    pt: 0,
    bg: 'none',
    borderRadius: '8px',
    flexGrow: 1,
  },
  contentTitle: {
    color: 'text.primary',
    mb: 1.5,
    fontWeight: 500,
    borderBottom: `1px solid ${theme.palette.divider}`,
    pb: 1,
  },
  posterBox: {
    display: 'flex',
    justifyContent: { sm: 'center', md: 'flex-start' },
    mb: 2,
  },
  posterImage: {
    width: '100%',
    maxWidth: '280px',
    height: 'auto',
    borderRadius: '8px',
    objectFit: 'cover',
    border: `1px solid ${theme.palette.divider}`,
  },
  detailsTextContainer: {
    color: 'text.primary',
    '& > *': {
      mb: 0.75,
      display: 'flex',
      alignItems: 'center',
    },
  },
  detailIcon: {
    verticalAlign: 'middle',
    mr: 1,
    color: 'primary.light',
  },
  ageRatingChip: {
    bgcolor: 'primary.dark',
    color: 'primary.contrastText',
    width: 'fit-content',
    p: '0.75rem !important',
  },
  infoDivider: {
    my: 1.5,
    borderColor: theme.palette.divider,
  },
  seatingPanelGridItem: { pt: '0 !important' },
  seatingPanelPaper: {
    p: { xs: 2, sm: 3 },
    pt: '0 !important',
    borderRadius: '8px',
  },
  seatingPanelTitle: {
    color: 'text.primary',
    mb: 1,
    textAlign: 'center',
    fontWeight: 500,
  },
  screenDisplayBox: {
    display: 'flex',
    justifyContent: 'center',
    mb: 4,
    userSelect: 'none',
  },
  screenElement: {
    width: { xs: '60%', sm: '50%', md: '40%' },
    py: 0.5,
    backgroundColor: theme.palette.grey[800],
    textAlign: 'center',
    color: 'text.primary',
    fontWeight: 'bold',
    letterSpacing: '3px',
    fontSize: { xs: '0.8rem', sm: '0.9rem' },
    clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)',
  },
  seatRowsContainer: {
    overflowX: 'auto',
    pb: 1,
    display: 'block',
    width: '100%',
    textAlign: 'center',
    '&::-webkit-scrollbar': {
      height: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.grey[700],
      borderRadius: '4px',
    },
  },
  seatRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'max-content',
    minWidth: '100%',
    margin: '0 auto',
    mb: { xs: '2px', sm: 1 },
    px: 3,
  },
  seatRowLabel: {
    width: { xs: '25px', sm: '30px' },
    textAlign: 'right',
    mr: 1,
    color: 'text.primary',
    alignSelf: 'center',
    fontSize: { xs: '0.65rem', sm: '0.8rem' },
  },
  seatButtonWrapper: {
    display: 'inline-block',
  },
  legendContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: { xs: 1, sm: 2 },
    mt: 2.5,
    mb: 3,
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
  },
  legendText: {
    color: 'text.primary',
  },
  selectedSeatInfoPaper: {
    p: 2,
    mt: 2,
    backgroundColor: '#232121',
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: '8px',
  },
  selectedSeatTitle: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    color: 'text.primary',
    mb: 2,
    fontWeight: 700,
    '& .MuiSvgIcon-root': {
      mr: 1,
    },
  },
  selectedSeatDetail: {
    color: 'text.primary',
    fontWeight: 700,
    mb: 0.35,
  },
  selectedSeatDetailValue: {
    fontWeight: 400,
    color: 'text.primary',
  },
  selectedSeatHighlight: {
    color: 'text.primary',
    fontWeight: 'bold',
    fontSize: '1.25rem',
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    '& .MuiSvgIcon-root': {
      mr: 1,
    },
  },
  bookButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    mt: 3,
  },
  bookButton: {
    px: 3,
    py: 1.25,
    fontSize: '1rem',
  },
  successDialogPaper: {
    backgroundColor: 'background.paper',
    borderRadius: '12px',
    p: 1,
  },
  successDialogTitle: {
    color: 'primary.main',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.75rem',
  },
  successDialogIcon: {
    verticalAlign: 'middle',
    mr: 1,
    fontSize: '2.2rem',
    color: 'primary.main',
  },
  successDialogContentText: {
    color: 'text.primary',
    textAlign: 'center',
    fontSize: '1.05rem',
    lineHeight: 1.6,
  },
  successDialogActions: {
    justifyContent: 'center',
    p: 2,
    gap: { xs: 1, sm: 2 },
  },
  snackbar: {
    bottom: { xs: 70, sm: 24 },
  },
  snackbarAlert: {
    width: '100%',
    boxShadow: 6,
    '.MuiAlert-icon': { alignItems: 'center' },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    py: 5,
    minHeight: 'calc(100vh - 128px)',
  },
  errorContainer: {
    py: 5,
    textAlign: 'center',
  },
  errorAlert: {
    mb: 2,
  },
  backToHomeButton: {
    mt: 2,
  },
});
