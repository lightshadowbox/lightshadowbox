import { updateIntl } from 'react-intl-redux';
import isEmpty from 'lodash/isEmpty';
import { LOCALE } from 'app/consts';
import langData from 'localization/lang.json';

export const getLaguageCode = () => {
    const browserLang = navigator && navigator.languages ? navigator.languages[0] : navigator.language || navigator.userLanguage;

    if (!isEmpty(browserLang)) return LOCALE.EN;

    if (browserLang.indexOf(LOCALE.VI) !== -1) return LOCALE.VI;

    return LOCALE.EN;
};

export const getInitStoreLang = () => {
    const langCode = getLaguageCode();
    return {
        locale: langCode,
        messages: langData[langCode] || {},
    };
};

export const changeLanguage = (langCode, dispatch) => {
    return (
        dispatch &&
        dispatch(
            updateIntl({
                locale: langCode,
                messages: langData[langCode] || {},
            }),
        )
    );
};

export const initialLocalization = {
    intl: getInitStoreLang(),
};
