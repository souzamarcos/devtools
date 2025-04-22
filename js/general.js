 const switchLang = (lang) => {
        const getNestedValue = (obj, key) => {
            return key.split('.').reduce((o, k) => {
                if (o && k.includes('[')) {
                    const [prop, index] = k.split(/\[|\]/).filter(Boolean);
                    return o[prop] && o[prop][index] !== undefined ? o[prop][index] : null;
                }
                return o && o[k] !== undefined ? o[k] : null;
            }, obj);
        };

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = getNestedValue(i18n[lang], key);
            if (value) el.textContent = value;
        });

        document.querySelectorAll('[data-placeholder-i18n]').forEach(el => {
            const key = el.getAttribute('data-placeholder-i18n');
            const value = getNestedValue(i18n[lang], key);
            if (value) el.placeholder = value;
        });

        document.documentElement.lang = lang;
    };