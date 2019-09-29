<template>
  <div class="multisig_map_container secondary_page_animate">
    <div class="left_container radius">
      <p class="multisig_title">{{$t('multisig')}}</p>
      <p>{{$t('Multisig_account_requires_additional_signatures_to_initiate_an_action_transfer')}}</p>

      <div class="multisig_table">
        <div class="multisig_table_head">
          <span class="public_key">{{$t('public_account')}}</span>
          <span class="current_cosigner">{{$t('current_cosigner')}}</span>
          <span class="current_multisig">{{$t('current_multisig')}}</span>
          <span class="min_approval">{{$t('min_approval')}}</span>
          <span class="min_removal">{{$t('min_removal')}}</span>
        </div>

        <div class="multisig_table_body">
          <div class="public_account_info">
            <span class="public_key overflow_ellipsis">{{publicKey}}</span>
            <span class="current_cosigner">{{multisigAccountInfo.cosignatories.length}}</span>
            <span class="current_multisig">{{multisigAccountInfo.multisigAccounts.length}}</span>
            <span class="min_approval">{{multisigAccountInfo.minApproval}}</span>
            <span class="min_removal">{{multisigAccountInfo.minRemoval}}</span>
            <span class="more_icon"></span>
          </div>
          <div v-for="(mc,index) in multisigAndCosignerList" class="accounts_details_info">
            <span class="role">{{$t('cosigner')}}{{index<9?'0'+(index+1):index+1}}</span>
            <span class="public_key">{{mc.publicKey}}</span>
            <span class="copy_icon"></span>
          </div>













        </div>
      </div>
    </div>

    <div class="right_container radius">
      <p class="multisig_title">{{$t('multisig')}}</p>
      <p class="tip_title"> {{$t('describe')}}</p>
      <p class="green">{{$t('NEM_account_can_be_converted_to_multiple_accounts_multisig')}}</p>
      <p>{{$t('Since_then_multisig_accounts_have_not_been_able_to_announce_transactions_on_their_own')}}</p>
      <p class="tip_title">{{$t('note')}}</p>
      <p class="green">{{$t('The_Multisig_account_is_a_powerful_tool_but_please_use_this_tool_with_caution')}}</p>
      <p>{{$t('If_the_signer_key_is_lost_and_the_minimum_approval_requirement_is_not_met')}}</p>


    </div>

  </div>
</template>

<script lang="ts">
    import {MultisigMapTs} from '@/views/service/multisig/multisig-functions/multisig-map/MultisigMapTs.ts'

    export default class MultisigMap extends MultisigMapTs {

    }
</script>
<style scoped lang="less">
  @import "MultisigMap.less";
</style>
