import {timeZoneListData, languageList} from '@/config/index.ts';
import {Component, Vue, Watch} from 'vue-property-decorator';
import {localSave, getCurrentTimeZone} from '@/core/utils/utils.ts';

@Component
export class SettingNormalTs extends Vue {
    languageList: any = languageList;
    coin = 'USD';
    timeZoneListData = timeZoneListData;
    coinList = [
        {
            value: 'USD',
            label: 'USD'
        },
    ];

    get language() {
        return this.$i18n.locale;
    }

    get timeZone() {
        return this.$store.state.app.timeZone;
    }

    set timeZone(timeZone) {
        this.$store.commit('SET_TIME_ZONE', timeZone);
    }

    set language(lang) {
        this.$i18n.locale = lang;
        localSave('locale', lang);
    }
}
