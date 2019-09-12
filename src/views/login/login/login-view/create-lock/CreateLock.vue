<template>
  <div class="createLockWrap scroll">
    <img class="close pointer" @click="hideIndexView" src="@/common/img/login/loginClose.png" alt="">
    <div class="pageTit">{{$t('CREATE_LOCK_PASSWORD')}}</div>
    <div class="pageRemind">{{$t('Locking_passwords_as_a_form_of_program_protection')}}</div>

    <form @submit.prevent="submit">
      <div class="formDiv">
        <ul>

          <li class="accouunt_name">
            <div class="gray_content">
              <input :placeholder="$t('set_wallet_name')" v-model="formItem.name">
            </div>
            <div class="tips">
              {{$t('Wallet_name_is_not_allowed_to_be_repeated')}}
            </div>
          </li>


          <li class="first-item">
            <div class="gray_content">
              <input
                      data-vv-name="newPassword"
                      v-model="formItem.password"
                      v-validate="standardFields.newPassword.validation"
                      type="password"
                      :placeholder="$t('Set_the_password')"
              >
              <img src="@/common/img/login/loginLock.png" alt="">
            </div>
            <div class="tips">
              {{$t(standardFields.newPassword.hint[0])}}. {{$t(standardFields.newPassword.hint[1])}}
            </div>
          </li>
          <li>
            <div class="gray_content">
              <input
                      data-vv-name="confirmPassword"
                      v-model="formItem.checkPW"
                      v-validate="standardFields.confirmPassword.validation"
                      type="password"
                      :placeholder="$t('Confirm_the_password')"
              >
            </div>
          </li>
          <li>
            <div class="gray_content">
              <input
                      data-vv-name="hint"
                      v-model="formItem.hint"
                      v-validate="standardFields.hint.validation"
                      type="text"
                      :placeholder="$t('Set_the_password_prompts')"
              >
              <img src="@/common/img/login/loginBell.png" alt="">
            </div>
          </li>
        </ul>
      </div>
      <div class="buttonDiv clear">
        <button type="submit" @click="toLoginAccount" class="pointer">LOGIN</button>
        <button type="submit" class="pointer">CREATE</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
    import {CreateLockTs} from '@/views/login/login/login-view/create-lock/CreateLockTs.ts'

    export default class InputLock extends CreateLockTs {
    }
</script>

<style scoped lang="less">
  @import "CreateLock.less";
</style>

