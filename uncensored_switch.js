(function () {
    'use strict';

    /**
     * Переключатель на Lampa Uncensored
     * - Пункт "Lampa Uncensored" в главном меню
     * - Раздел в настройках с кнопкой перехода
     * - Опция автоматического перехода при запуске (по умолчанию выключена)
     */

    if (window.plugin_uncensored_switch_ready) return;
    window.plugin_uncensored_switch_ready = true;

    var TARGET = 'http://my.bylampa.online';

    var ICON = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';

    function isTargetHost() {
        try {
            return location.hostname === 'my.bylampa.online';
        } catch (e) {
            return false;
        }
    }

    function goTo() {
        if (isTargetHost()) {
            Lampa.Noty.show('Вы уже в Lampa Uncensored');
            return;
        }

        Lampa.Noty.show('Переход в Lampa Uncensored...');

        setTimeout(function () {
            window.location.href = TARGET;
        }, 400);
    }

    function addMenuButton() {
        var item = $(
            '<li class="menu__item selector" data-action="uncensored_switch">' +
                '<div class="menu__ico">' + ICON + '</div>' +
                '<div class="menu__text">Lampa Uncensored</div>' +
            '</li>'
        );

        item.on('hover:enter', goTo);
        $('.menu .menu__list').eq(0).append(item);
    }

    function addSettings() {
        Lampa.SettingsApi.addComponent({
            component: 'uncensored_switch',
            name: 'Lampa Uncensored',
            icon: ICON
        });

        Lampa.SettingsApi.addParam({
            component: 'uncensored_switch',
            param: { name: 'uncensored_go', type: 'button' },
            field: {
                name: 'Перейти в Lampa Uncensored',
                description: TARGET
            },
            onChange: goTo
        });

        Lampa.SettingsApi.addParam({
            component: 'uncensored_switch',
            param: { name: 'uncensored_auto', type: 'trigger', default: false },
            field: {
                name: 'Переходить при запуске',
                description: 'Автоматически открывать Lampa Uncensored при старте приложения'
            }
        });
    }

    function start() {
        addSettings();
        addMenuButton();

        if (Lampa.Storage.get('uncensored_auto', false) && !isTargetHost()) {
            goTo();
        }
    }

    if (window.appready) start();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') start();
        });
    }
})();
