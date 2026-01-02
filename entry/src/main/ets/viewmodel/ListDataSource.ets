/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
 * Licensed under the Apache License,Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GoodsListItemType, getRefreshedGoodsByCategory, CATEGORIES } from './InitialData';
import { searchGoodsByKeyword } from './SearchUtils';
import { MAX_DATA_LENGTH } from '../common/CommonConstants';

/**
 * List数据源类，用于LazyForEach懒加载
 */
export class ListDataSource implements IDataSource {
  private listeners: DataChangeListener[] = [];
  private dataArray: GoodsListItemType[] = [];
  private currentIndex: number = 0;
  private category: string = CATEGORIES.SELECTED;
  private maxLoadedIndex: number = 0; // 记录已加载的最大索引

  constructor(category: string = CATEGORIES.SELECTED) {
    this.category = category;
    // 初始化数据
    this.dataArray = getRefreshedGoodsByCategory(category);
    this.currentIndex = this.dataArray.length;
    this.maxLoadedIndex = this.dataArray.length;
  }

  totalCount(): number {
    return MAX_DATA_LENGTH;
  }

  getData(index: number): GoodsListItemType {
    // 如果索引超出当前数据范围，预加载更多数据
    if (index >= this.dataArray.length - 6 && this.dataArray.length < MAX_DATA_LENGTH) {
      this.pushData();
    }

    // 如果索引有效，返回数据，否则返回最后一个数据
    if (index < this.dataArray.length) {
      return this.dataArray[index];
    }
    
    // 如果索引超出范围，返回最后一个有效数据
    return this.dataArray[this.dataArray.length - 1];
  }

  registerDataChangeListener(listener: DataChangeListener): void {
    this.listeners.push(listener);
  }

  unregisterDataChangeListener(listener: DataChangeListener): void {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * 推送更多数据（加载更多）
   */
  pushData(): void {
    console.log('=== 懒加载调试日志 ===');
    console.log('当前数据长度:', this.dataArray.length);
    console.log('当前最大索引:', this.maxLoadedIndex);
    console.log('分类:', this.category);
    
    // 模拟网络延迟
    setTimeout(() => {
      const newData: GoodsListItemType[] = [];
      const startIndex = this.dataArray.length;
      
      console.log('开始懒加载，从索引:', startIndex);
      console.log('开始ID:', this.maxLoadedIndex + 1);

      // 每次加载8个新商品（减少数量以避免问题）
      for (let i = 0; i < 8 && this.dataArray.length < MAX_DATA_LENGTH; i++) {
        const id = this.maxLoadedIndex + i + 1;
        const imageIndex = id % 4; // 0-3，刚好匹配每个分类的4张图片
        let goodsName: string = getGoodsNameByCategoryAndIndex(this.category, imageIndex);
        let price: ResourceStr = getPriceByIndex(this.category, imageIndex);

        console.log(`创建商品 ${i + 1}: ID=${id}, 名称: ${goodsName}, 分类: ${this.category}`);

        newData.push({
          id: id,
          goodsName: goodsName,
          price: price,
          goodsImg: getImageByCategoryAndIndex(this.category, imageIndex), // 用分类专属图片
          advertisingLanguage: $r('app.string.advertising_language'),
          evaluate: $r('app.string.evaluate'),
          category: this.category
        });
      }

      if (newData.length > 0) {
        console.log('成功创建', newData.length, '个新商品');
        this.dataArray.push(...newData);
        this.maxLoadedIndex += newData.length;
        this.currentIndex = this.dataArray.length;

        // 通知数据变化
        this.listeners.forEach(listener => {
          listener.onDataAdd?.(startIndex);
          listener.onDataReloaded?.();
        });
        
        console.log('懒加载完成，当前总数据长度:', this.dataArray.length);
      } else {
        console.log('没有更多数据可以加载');
      }
      console.log('=== 懒加载调试日志结束 ===');
    }, 500);
  }

  /**
   * 刷新数据
   */
  refreshData(): void {
    console.log('=== 刷新数据调试日志 ===');
    console.log('刷新分类:', this.category);
    console.log('刷新前数据长度:', this.dataArray.length);
    
    // 模拟网络延迟
    setTimeout(() => {
      this.dataArray = getRefreshedGoodsByCategory(this.category);
      this.currentIndex = this.dataArray.length;
      this.maxLoadedIndex = this.dataArray.length; // 重置最大索引
      
      console.log('刷新后数据长度:', this.dataArray.length);
      console.log('重置最大索引为:', this.maxLoadedIndex);

      // 通知数据刷新
      this.listeners.forEach(listener => {
        listener.onDataReloaded?.();
      });
      
      console.log('=== 刷新数据完成 ===');
    }, 1000);
  }

  /**
   * 设置分类
   */
  setCategory(category: string): void {
    if (this.category !== category) {
      console.log('=== 切换分类调试日志 ===');
      console.log('从分类切换到:', category);
      console.log('切换前数据长度:', this.dataArray.length);
      
      this.category = category;
      this.dataArray = getRefreshedGoodsByCategory(category);
      this.currentIndex = this.dataArray.length;
      this.maxLoadedIndex = this.dataArray.length; // 重置最大索引
      
      console.log('切换后数据长度:', this.dataArray.length);
      console.log('重置最大索引为:', this.maxLoadedIndex);

      // 通知数据刷新
      this.listeners.forEach(listener => {
        listener.onDataReloaded?.();
      });
      
      console.log('=== 切换分类完成 ===');
    }
  }

  /**
   * 搜索商品
   */
  searchGoods(keyword: string): void {
    console.log('=== 搜索商品调试日志 ===');
    console.log('搜索关键词:', keyword);
    console.log('搜索分类:', this.category);
    
    if (keyword.trim() === '') {
      // 如果搜索关键词为空，显示当前分类的所有商品
      this.dataArray = getRefreshedGoodsByCategory(this.category);
    } else {
      // 根据关键词搜索商品
      this.dataArray = searchGoodsByKeyword(this.category, keyword.trim());
    }
    this.currentIndex = this.dataArray.length;
    this.maxLoadedIndex = this.dataArray.length; // 重置最大索引
    
    console.log('搜索结果数量:', this.dataArray.length);
    console.log('重置最大索引为:', this.maxLoadedIndex);

    // 通知数据刷新
    this.listeners.forEach(listener => {
      listener.onDataReloaded?.();
    });
    
    console.log('=== 搜索完成 ===');
  }
}

// 根据分类和索引获取价格
function getPriceByIndex(category: string, imageIndex: number): ResourceStr {
  const index = (imageIndex % 4) + 1; // 转换为1-4的范围

  switch (category) {
    case CATEGORIES.MOBILE_PHONE:
      switch (index) {
        case 1: return $r('app.string.goods_price_phone_1');
        case 2: return $r('app.string.goods_price_phone_2');
        case 3: return $r('app.string.goods_price_phone_3');
        case 4: return $r('app.string.goods_price_phone_4');
        default: return $r('app.string.goods_price_phone_1');
      }
    case CATEGORIES.CLOTHES:
      switch (index) {
        case 1: return $r('app.string.goods_price_clothes_1');
        case 2: return $r('app.string.goods_price_clothes_2');
        case 3: return $r('app.string.goods_price_clothes_3');
        case 4: return $r('app.string.goods_price_clothes_4');
        default: return $r('app.string.goods_price_clothes_1');
      }
    case CATEGORIES.WEAR:
      switch (index) {
        case 1: return $r('app.string.goods_price_wear_1');
        case 2: return $r('app.string.goods_price_wear_2');
        case 3: return $r('app.string.goods_price_wear_3');
        case 4: return $r('app.string.goods_price_wear_4');
        default: return $r('app.string.goods_price_wear_1');
      }
    case CATEGORIES.HOME_FURNISHING:
      switch (index) {
        case 1: return $r('app.string.goods_price_home_1');
        case 2: return $r('app.string.goods_price_home_2');
        case 3: return $r('app.string.goods_price_home_3');
        case 4: return $r('app.string.goods_price_home_4');
        default: return $r('app.string.goods_price_home_1');
      }
    default:
      // 默认价格
      return $r('app.string.goods_price_phone_1');
  }
}

// 根据获取图片
function getImageByCategoryAndIndex(category: string, index: number): Resource {
  const imageIndex = (index % 4) + 1;

  switch (category) {
    case CATEGORIES.SELECTED:
      return getSelectedImage(imageIndex);
    case CATEGORIES.MOBILE_PHONE:
      return getPhoneImage(imageIndex);
    case CATEGORIES.CLOTHES:
      return getClothesImage(imageIndex);
    case CATEGORIES.WEAR:
      return getWearImage(imageIndex);
    case CATEGORIES.HOME_FURNISHING:
      return getHomeImage(imageIndex);
    default:
      return $r('app.media.goodsImg');
  }
}

// 定义每个分类的图片获取函数
function getSelectedImage(index: number): Resource {
  switch (index) {
    case 1: return $r('app.media.goodsImg');
    case 2: return $r('app.media.goodsImg_2');
    case 3: return $r('app.media.goodsImg_3');
    case 4: return $r('app.media.goodsImg_4');
    default: return $r('app.media.goodsImg');
  }
}

function getPhoneImage(index: number): Resource {
  switch (index) {
    case 1: return $r('app.media.phone1');
    case 2: return $r('app.media.phone2');
    case 3: return $r('app.media.phone3');
    case 4: return $r('app.media.phone4');
    default: return $r('app.media.phone1');
  }
}
function getClothesImage(index: number): Resource {
  switch (index) {
    case 1: return $r('app.media.clothes1');
    case 2: return $r('app.media.clothes2');
    case 3: return $r('app.media.clothes3');
    case 4: return $r('app.media.clothes4');
    default: return $r('app.media.clothes1');
  }
}
function getWearImage(index: number): Resource {
  switch (index) {
    case 1: return $r('app.media.wear1');
    case 2: return $r('app.media.wear2');
    case 3: return $r('app.media.wear3');
    case 4: return $r('app.media.wear4');
    default: return $r('app.media.wear1');
  }
}
function getHomeImage(index: number): Resource {
  switch (index) {
    case 1: return $r('app.media.home1');
    case 2: return $r('app.media.home2');
    case 3: return $r('app.media.home3');
    case 4: return $r('app.media.home4');
    default: return $r('app.media.home1');
  }
}

// 获取商品名称（返回字符串类型）
function getGoodsNameByCategoryAndIndex(category: string, index: number): string {
  const imageIndex = (index % 4) + 1; // 转换为1-4的范围

  switch (category) {
    case CATEGORIES.MOBILE_PHONE:
      switch (imageIndex) {
        case 1: return 'vivo X300 Pro新品蔡司2亿APO超级长焦天玑9500拍照手机官方旗舰店官网正品';
        case 2: return 'HUAWEI Mate 80 麒麟9020芯片 第二代红枫影像 鸿蒙AI 华为直屏鸿蒙智能手机华为官方旗舰店';
        case 3: return 'Apple/苹果 iPhone 17 Pro Max 手机 A19 Pro芯片 2025新款 全新未拆封，官方正品';
        case 4: return '小米17 Pro手机新品上市小米徕卡联合研发小米官方旗舰店官网小米澎湃OS小米17pro';
        default: return 'vivo X300 Pro新品蔡司2亿APO超级长焦天玑9500拍照手机官方旗舰店官网正品';
      }
    case CATEGORIES.CLOTHES:
      switch (imageIndex) {
        case 1: return '花纱羊毛混纺半高领毛衣开衫老钱棕色灰色百搭cleanfit';
        case 2: return 'OUR LEGACY Evening男士黑色Polo衫休闲宽松复古针织开衫外套';
        case 3: return 'No day off「烧边牛角扣」羊毛混纺针织亨利领毛衣纯色基础长袖男';
        case 4: return '高知感舒芙蕾休闲复古慵懒羊毛混纺毛织开衫外套';
        default: return '花纱羊毛混纺半高领毛衣开衫老钱棕色灰色百搭cleanfit';
      }
    case CATEGORIES.WEAR:
      switch (imageIndex) {
        case 1: return 'Apple Watch Series 11 GPS + 蜂窝款 44mm 钛金属表壳 海洋表带 智能手表';
        case 2: return '【新品上市】Huawei/华为 WATCH GT 6智能手表21天超长续航华为手机专卖店智能穿戴设备健康全新骑行体验';
        case 3: return '小米手环10智能手环运动健康防水睡眠心率全面屏长续航小米手环9升级款';
        case 4: return '三星/Samsung Galaxy Watch8 智能手表 运动AI心率监测睡眠监测血氧血压心率适配三星三折叠';
        default: return 'Apple Watch Series 11 GPS + 蜂窝款 44mm 钛金属表壳 海洋表带 智能手表';
      }
    case CATEGORIES.HOME_FURNISHING:
      switch (imageIndex) {
        case 1: return '草地浮游水气缸桌面灯摆件氛围小夜灯鱼缸';
        case 2: return '物有引力 财火灯 复古氛围灯卧室床头小夜灯充电民宿装饰圣诞创意';
        case 3: return '现代轻奢椭圆形装饰托盘样板房创意家居餐桌茶几水果盘收纳盘摆件';
        case 4: return '原木奶油风客厅装饰画趣味猫咪沙发背景墙挂画立体砂岩高级感壁画';
        default: return '草地浮游水气缸桌面灯摆件氛围小夜灯鱼缸';
      }
    default:
      // 默认分类
      return imageIndex % 2 === 0 ? '【新品上市】畅乐冰晶绿低脂新品' : '【新品上市】奶茶自然清新亲近自然';
  }
}

