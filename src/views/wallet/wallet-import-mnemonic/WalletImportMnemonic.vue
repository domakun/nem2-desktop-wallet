<template>
  <div>
    <div class="mnemonic">
      <div class="describle">{{$t('mnemonic_describle')}}</div>
      <ul>
        <li>
          {{$t('input_mnemonic')}}
          <div class="tips">
            {{$t('enter_12_words_please_pay_attention_to_the_order_separated_by_a_space_between_each_word')}}
          </div>
          <div class="gray_content textarea">
            <textarea class="absolute" v-model="form.mnemonic"/>
          </div>
        </li>
        <li>
          {{$t('choose_hd_wallet_path')}}
          <div class="tips">
            {{$t('input_hd_wallet_path')}}
          </div>
          <div class="gray_content">
            <input class="absolute" v-model="form.derivePath"
                   :placeholder="$t('input_hd_wallet_path')">
          </div>
        </li>
        <li>
          {{$t('choose_network')}}
          <div class="gray_content">
            <Select v-model="form.networkType" :placeholder="$t('choose_network')">
              <Option v-for="item in NetworkTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </li>
        <li>
          {{$t('set_the_wallet_name')}}
          <div class="gray_content">
            <input class="absolute" type="text" v-model="form.walletName"
                   :placeholder="$t('set_the_wallet_name')">
          </div>
        </li>
      </ul>

    </div>
    <div class="bottom_button ">
      <span class="back left" @click="toBack"> {{$t('back')}}</span>
      <span class="import right" @click="submit">{{$t('import')}}</span>
    </div>
    <CheckPWDialog
            :isOnlyCheckPassword="true"
            :showCheckPWDialog="showCheckPWDialog"
            @closeCheckPWDialog="closeCheckPWDialog"
            @checkEnd="checkEnd"
    />
  </div>

</template>

<script lang="ts">
    //@ts-ignore
    import {WalletImportMnemonicTs} from '@/views/wallet/wallet-import-mnemonic/WalletImportMnemonicTs.ts'

    export default class WalletImportMnemonic extends WalletImportMnemonicTs {

    }
</script>
<style scoped lang="less">
  @import "WalletImportMnemonic";
</style>
