<template>
  <div class="mosaicList secondary_page_animate">
    <div class="mosaicListBody scroll">
      <div class="listTit">
<!--        <Dropdown trigger="click" class="screen" @on-click="screenByDeadline" >-->
<!--        <a>-->
<!--            {{$t('screen')}}-->
<!--            <Icon type="ios-arrow-down"></Icon>-->
<!--        </a>-->
<!--        <DropdownMenu slot="list" >-->
<!--            <DropdownItem name="[0,100000]">0~10000</DropdownItem>-->
<!--            <DropdownItem name="[100000,200000]">100000~200000</DropdownItem>-->
<!--            <DropdownItem name="[200000,10000000]">20000~{{$t('forever')}}</DropdownItem>-->
<!--        </DropdownMenu>-->
<!--    </Dropdown>-->
        <Row>
          <Col span="1">&nbsp;</Col>
          <Col span="4">
            {{$t('mosaic_ID')}}
          </Col>
          <Col span="3">
            {{$t('available_quantity')}}
          </Col>
          <Col span="2">
            {{$t('mosaic_divisibility')}}
          </Col>
          <Col span="2">
            {{$t('transportability')}}
          </Col>
          <Col span="2">
            {{$t('variable_supply')}}
          </Col>
          <Col span="2">
            {{$t('deadline')}}
          </Col>
          <Col span="2">
            {{$t('Restrictable')}}
          </Col>
          <Col span="3">
            {{$t('alias')}}
          </Col>
          <Col span="2">

          </Col>
        </Row>
      </div>
      <Spin v-if="mosaicsLoading" size="large" fix class="absolute"></Spin>
      <div class="no_data" v-if="false">{{$t('no_data')}}</div>
      <div
              v-for="(value, key) in (screenMosaic.length > 0 ? currentScreenMosaic : currentMosaicPage)"
              :key="key"
              class="listItem"
      >
        <Row>
          <Col span="1">&nbsp;</Col>
          <Col span="4">{{value.hex}}</Col>
          <Col span="3">{{formatNumber(value.mosaicInfo.supply.compact())}}</Col>
          <Col span="2" style="padding-left: 20px">{{value.properties.divisibility}}</Col>
          <Col span="2">
            <Icon v-if="value.properties.transferable" type="md-checkmark"/>
            <Icon v-else type="md-close"/>
          </Col>
          <Col span="2">
            <Icon v-if="value.properties.supplyMutable" type="md-checkmark"/>
            <Icon v-else type="md-close"/>
          </Col>
          <Col span="2">
            {{computeDuration(value) <= 0 ? $t('overdue') : (computeDuration(value) === 'Forever'?
            $t('forever') : formatNumber(computeDuration(value)))}}
          </Col>
          <Col span="2">
            <Icon v-if="value.isRestrictable" type="md-checkmark"/>
            <Icon v-else type="md-close"/>
          </Col>
          <Col span="3">{{value.name?value.name:'N/A'}}</Col>
          <Col span="2">
            <div
                    class="listFnDiv"
                    v-if="computeDuration(value) > 0 || computeDuration(value) === 'Forever'"
            >
              <Poptip placement="bottom">
                <i class="moreFn"></i>
                <div slot="content" class="updateFn">
                  <p class="fnItem" @click="showEditDialog(value)" v-if="value.supplyMutable">
                    <i><img src="@/common/img/service/updateMsaioc.png"></i>
                    <span class="">{{$t('modify_supply')}}</span>
                  </p>
                  <p class="fnItem" @click="showAliasDialog(value)">
                    <i><img src="@/common/img/service/setAlias.png"></i>
                    <span>{{$t('binding_alias')}}</span>
                  </p>

                  <p class="fnItem" @click="showUnAliasDialog(value)" v-if="value.name">
                    <i><img src="@/common/img/service/clearAlias.png"></i>
                    <span>{{$t('unbind')}}</span>
                  </p>
                </div>
              </Poptip>
            </div>
          </Col>
        </Row>
      </div>
     <template>
        <div class = "page_container">
          <Page
            class = "page"
            :total="(screenMosaic.length > 0 ? screenMosaic.length:filteredMosaics.length)"
            @on-change ="toggleChange"
            :page-size ="pageSize"
            />
        </div>
    </template>
    </div>

    <MosaicAliasDialog :showMosaicAliasDialog="showMosaicAliasDialog" :itemMosaic="selectedMosaic"
                       @closeMosaicAliasDialog="closeMosaicAliasDialog"></MosaicAliasDialog>
    <MosaicUnAliasDialog :showMosaicUnAliasDialog="showMosaicUnAliasDialog" :itemMosaic="selectedMosaic"
                         @closeMosaicUnAliasDialog="closeMosaicUnAliasDialog"></MosaicUnAliasDialog>
    <EditDialog :showMosaicEditDialog="showMosaicEditDialog" :itemMosaic="selectedMosaic"
                @closeMosaicEditDialog="closeMosaicEditDialog"></EditDialog>
  </div>
</template>

<script lang="ts">
    import {MosaicListTs} from '@/views/service/mosaic/mosaic-function/mosaic-list/MosaicListTs.ts'
    import "./MosaicList.less"
import { Deadline } from 'nem2-sdk';
    export default class MosaicList extends MosaicListTs {

    }
</script>
<style scoped lang="less">

</style>
