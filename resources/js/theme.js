// Professional Corporate Design System
// Green Color palette - Perfect for Agriculture Academy

export const colors = {
    // Primary Greens - Agriculture & Growth
    primary: '#1B5E20',           // Deep Forest Green
    primaryHover: '#2E7D32',      // Medium Green
    primaryPressed: '#0D4A11',    // Darker Green
    primaryLight: '#E8F5E9',      // Light Green Tint

    // Secondary - Professional Dark
    secondary: '#1B3A1B',         // Dark Green
    secondaryHover: '#2D4A2D',    // Slightly lighter

    // Accent - Gold (Agriculture/Wheat)
    accent: '#C49A00',
    accentLight: '#FFF8E1',

    // Semantic Colors
    success: '#2E7D32',
    successLight: '#E8F5E9',
    warning: '#F57C00',
    warningLight: '#FFF3E0',
    error: '#C62828',
    errorLight: '#FFEBEE',
    info: '#1565C0',
    infoLight: '#E3F2FD',

    // Neutral Grays
    gray900: '#1A1A1A',
    gray800: '#2D2D2D',
    gray700: '#424242',
    gray600: '#616161',
    gray500: '#757575',
    gray400: '#9E9E9E',
    gray300: '#BDBDBD',
    gray200: '#E0E0E0',
    gray100: '#EEEEEE',
    gray50: '#F5F5F5',
    gray25: '#FAFAFA',

    // Backgrounds
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F5F7F5',       // Slight green tint
    bgDark: '#1B3A1B',
    bgGradient: 'linear-gradient(135deg, #1B3A1B 0%, #1B5E20 100%)',
};

export const shadows = {
    xs: '0 1px 2px rgba(27, 58, 27, 0.04)',
    sm: '0 1px 3px rgba(27, 58, 27, 0.1), 0 0 1px rgba(27, 58, 27, 0.08)',
    md: '0 4px 8px rgba(27, 58, 27, 0.08), 0 0 1px rgba(27, 58, 27, 0.06)',
    lg: '0 8px 16px rgba(27, 58, 27, 0.12), 0 0 1px rgba(27, 58, 27, 0.06)',
    xl: '0 16px 32px rgba(27, 58, 27, 0.16), 0 0 1px rgba(27, 58, 27, 0.06)',
    card: '0 1px 3px rgba(27, 58, 27, 0.1), 0 0 1px rgba(27, 58, 27, 0.08)',
    cardHover: '0 8px 24px rgba(27, 94, 32, 0.15), 0 0 1px rgba(27, 58, 27, 0.08)',
    button: '0 2px 4px rgba(27, 94, 32, 0.25)',
    buttonHover: '0 4px 12px rgba(27, 94, 32, 0.35)',
};

export const transitions = {
    fast: '150ms ease-out',
    normal: '250ms ease-out',
    slow: '350ms ease-out',
};

export const theme = {
    token: {
        // Professional Blue Palette
        colorPrimary: colors.primary,
        colorSuccess: colors.success,
        colorWarning: colors.warning,
        colorError: colors.error,
        colorInfo: colors.info,

        // Typography
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 14,
        fontSizeHeading1: 32,
        fontSizeHeading2: 24,
        fontSizeHeading3: 20,
        fontSizeHeading4: 16,
        fontSizeHeading5: 14,

        // Text Colors
        colorText: colors.gray700,
        colorTextSecondary: colors.gray500,
        colorTextTertiary: colors.gray400,
        colorTextHeading: colors.gray900,

        // Borders
        colorBorder: colors.gray200,
        colorBorderSecondary: colors.gray100,

        // Backgrounds
        colorBgContainer: colors.bgPrimary,
        colorBgLayout: colors.bgSecondary,
        colorBgElevated: colors.bgPrimary,

        // Refined Spacing & Sizing
        borderRadius: 8,
        borderRadiusLG: 12,
        borderRadiusSM: 6,
        borderRadiusXS: 4,

        // Control heights
        controlHeight: 40,
        controlHeightLG: 48,
        controlHeightSM: 32,

        // Spacing
        padding: 16,
        paddingLG: 24,
        paddingSM: 12,
        paddingXS: 8,
        margin: 16,
        marginLG: 24,
        marginSM: 12,
        marginXS: 8,

        // Professional Shadows
        boxShadow: shadows.sm,
        boxShadowSecondary: shadows.md,
        boxShadowTertiary: shadows.lg,

        // Motion
        motionDurationFast: '0.15s',
        motionDurationMid: '0.25s',
        motionDurationSlow: '0.35s',
        motionEaseOut: 'ease-out',
        motionEaseInOut: 'ease-in-out',
    },
    components: {
        Layout: {
            siderBg: colors.secondary,
            headerBg: colors.bgPrimary,
            bodyBg: colors.bgSecondary,
            triggerBg: colors.primary,
        },
        Menu: {
            darkItemBg: colors.secondary,
            darkItemSelectedBg: colors.primary,
            darkItemHoverBg: colors.secondaryHover,
            darkSubMenuItemBg: colors.secondary,
            itemBorderRadius: 6,
            itemMarginInline: 8,
            iconSize: 18,
        },
        Button: {
            primaryShadow: shadows.button,
            fontWeight: 500,
            borderRadius: 8,
            controlHeight: 40,
            controlHeightLG: 48,
            controlHeightSM: 32,
            paddingInline: 20,
            paddingInlineLG: 24,
            paddingInlineSM: 16,
        },
        Card: {
            borderRadiusLG: 12,
            boxShadowTertiary: shadows.card,
            paddingLG: 24,
        },
        Input: {
            borderRadius: 8,
            controlHeight: 40,
            controlHeightLG: 48,
            activeBorderColor: colors.primary,
            hoverBorderColor: colors.primaryHover,
            activeShadow: `0 0 0 3px ${colors.primaryLight}`,
        },
        Select: {
            borderRadius: 8,
            controlHeight: 40,
            controlHeightLG: 48,
        },
        DatePicker: {
            borderRadius: 8,
            controlHeight: 40,
        },
        Table: {
            borderRadius: 12,
            headerBg: colors.gray50,
            headerColor: colors.gray700,
            rowHoverBg: colors.primaryLight,
            headerSortActiveBg: colors.gray100,
            bodySortBg: colors.gray25,
        },
        Tabs: {
            itemActiveColor: colors.primary,
            itemHoverColor: colors.primaryHover,
            inkBarColor: colors.primary,
        },
        Modal: {
            borderRadiusLG: 16,
            headerBg: colors.bgPrimary,
            contentBg: colors.bgPrimary,
            titleFontSize: 18,
        },
        Dropdown: {
            borderRadiusLG: 12,
            controlItemBgHover: colors.gray50,
        },
        Tag: {
            borderRadiusSM: 6,
        },
        Alert: {
            borderRadiusLG: 12,
        },
        Message: {
            borderRadiusLG: 12,
        },
        Notification: {
            borderRadiusLG: 12,
        },
        Breadcrumb: {
            itemColor: colors.gray500,
            lastItemColor: colors.gray700,
            linkColor: colors.primary,
            linkHoverColor: colors.primaryHover,
        },
        Steps: {
            colorPrimary: colors.primary,
        },
        Progress: {
            defaultColor: colors.primary,
        },
        Statistic: {
            titleFontSize: 14,
            contentFontSize: 28,
        },
    },
};

// CSS Custom Properties for use in styled-components or CSS
export const cssVars = {
    '--color-primary': colors.primary,
    '--color-primary-hover': colors.primaryHover,
    '--color-primary-light': colors.primaryLight,
    '--color-secondary': colors.secondary,
    '--color-success': colors.success,
    '--color-warning': colors.warning,
    '--color-error': colors.error,
    '--color-gray-900': colors.gray900,
    '--color-gray-700': colors.gray700,
    '--color-gray-500': colors.gray500,
    '--color-gray-300': colors.gray300,
    '--color-gray-100': colors.gray100,
    '--color-gray-50': colors.gray50,
    '--shadow-sm': shadows.sm,
    '--shadow-md': shadows.md,
    '--shadow-lg': shadows.lg,
    '--shadow-card': shadows.card,
    '--shadow-card-hover': shadows.cardHover,
    '--transition-fast': transitions.fast,
    '--transition-normal': transitions.normal,
    '--bg-gradient': colors.bgGradient,
};
