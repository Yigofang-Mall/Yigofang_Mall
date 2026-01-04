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

import { GoodsListItemType } from './InitialData';
import { SortType, PriceRangeFilter } from '../view/SortDialogComponent';

/**
 * ResourceStr 内部结构接口（用于类型安全访问）
 */
interface ResourceStrInternal {
  id?: number;
  type?: number;
  params?: string[];
  value?: string | number;
  toString?: () => string;
}

/**
 * 从ResourceStr中解析价格数字
 * 支持格式：¥199、¥265、¥810、¥999等
 * @param priceStr 价格字符串（ResourceStr）
 * @returns 价格数字，解析失败返回0
 */
export function parsePrice(priceStr: ResourceStr): number {
  let priceString: string = '';
  
  try {
    // 检查 priceStr 的类型
    if (typeof priceStr === 'string') {
      // 如果已经是字符串，直接使用
      priceString = priceStr;
      console.log(`[价格解析] 直接字符串类型: "${priceString}"`);
    } else {
      // ResourceStr 是对象类型，需要特殊处理
      const resourceObj = priceStr as ResourceStrInternal;
      
      // 方法1: 尝试访问可能的属性来获取值
      // 在 HarmonyOS 中，ResourceStr 可能包含 id 属性，需要通过 ResourceManager 获取
      // 但这里我们尝试直接访问可能的属性
      
      // 尝试访问 value 属性
      if (resourceObj.value !== undefined && resourceObj.value !== null) {
        if (typeof resourceObj.value === 'string') {
          priceString = resourceObj.value;
          console.log(`[价格解析] 从 value 属性获取: "${priceString}"`);
        } else if (typeof resourceObj.value === 'number') {
          priceString = String(resourceObj.value);
          console.log(`[价格解析] 从 value 属性(数字)获取: "${priceString}"`);
        }
      }
      
      // 方法2: 尝试使用 getContext 和 ResourceManager（如果可用）
      if (priceString.length === 0) {
        try {
          // 注意：这需要在组件上下文中调用
          // 在 HarmonyOS 中，ResourceStr 包含 id，需要通过 ResourceManager 获取
          const context = getContext();
          if (context && resourceObj.id !== undefined) {
            const resourceManager = context.resourceManager;
            if (resourceManager) {
              try {
                const strValue = resourceManager.getStringSync(resourceObj.id);
                if (strValue && strValue.length > 0) {
                  priceString = strValue;
                  console.log(`[价格解析] 从 ResourceManager 获取: "${priceString}"`);
                }
              } catch (rmError) {
                console.log('[价格解析] ResourceManager.getStringSync 失败:', rmError);
              }
            }
          }
        } catch (e) {
          // getContext 可能不可用，忽略
          console.log('[价格解析] 无法使用 ResourceManager，尝试其他方法');
        }
      }
      // 方法3: 尝试通过已知的属性获取
      if (priceString.length === 0) {
        // 检查已知的属性：value, params中的第一个元素，或toString方法
        if (resourceObj.value && typeof resourceObj.value === 'string' && /\d/.test(resourceObj.value)) {
          priceString = resourceObj.value;
          console.log(`[价格解析] 从 value 属性获取: "${priceString}"`);
        } else if (resourceObj.params && resourceObj.params.length > 0) {
          const firstParam = resourceObj.params[0];
          if (typeof firstParam === 'string' && /\d/.test(firstParam)) {
            priceString = firstParam;
            console.log(`[价格解析] 从 params 属性获取: "${priceString}"`);
          }
        } else if (resourceObj.toString) {
          const strValue = resourceObj.toString();
          if (typeof strValue === 'string' && /\d/.test(strValue)) {
            priceString = strValue;
            console.log(`[价格解析] 从 toString 方法获取: "${priceString}"`);
          }
        }
      }
      
      // 方法4: 如果以上方法都失败，记录详细信息用于调试
      if (priceString.length === 0) {
        console.error('[价格解析] ResourceStr 无法转换为字符串');
        console.error('[价格解析] ResourceStr 类型:', typeof priceStr);
        console.error('[价格解析] ResourceStr 对象:', JSON.stringify(resourceObj, null, 2));
        console.error('[价格解析] ResourceStr 属性列表:', Object.keys(resourceObj));
        if (resourceObj.id !== undefined) {
          console.error('[价格解析] Resource ID:', resourceObj.id);
        }
        if (resourceObj.type !== undefined) {
          console.error('[价格解析] Resource Type:', resourceObj.type);
        }
        return 0;
      }
    }
    
    // 移除所有非数字字符（保留小数点）
    const numericString = priceString.replace(/[^\d.]/g, '');
    
    // 如果提取的数字字符串为空，返回0
    if (numericString.length === 0) {
      console.error(`[价格解析] 无法从价格字符串中提取数字`);
      console.error(`[价格解析] 原始字符串: "${priceString}"`);
      return 0;
    }
    
    // 转换为数字
    const price = parseFloat(numericString);
    
    // 如果转换失败，返回0
    if (isNaN(price)) {
      console.error(`[价格解析] 数字转换失败`);
      console.error(`[价格解析] 数字字符串: "${numericString}"`);
      console.error(`[价格解析] 原始字符串: "${priceString}"`);
      return 0;
    }
    
    // 成功解析
    console.log(`[价格解析] ✓ 成功解析 - 原始: "${priceString}", 数字: "${numericString}", 结果: ${price}`);
    
    return price;
  } catch (error) {
    console.error('[价格解析] 价格解析异常:', error);
    console.error('[价格解析] 原始 priceStr 类型:', typeof priceStr);
    if (typeof priceStr === 'object') {
      console.error('[价格解析] 原始 priceStr 对象:', priceStr);
    }
    return 0;
  }
}

/**
 * 根据价格区间筛选商品
 * @param goodsList 商品列表
 * @param priceFilter 价格区间筛选条件
 * @returns 筛选后的商品列表
 */
export function filterGoodsByPriceRange(goodsList: GoodsListItemType[], priceFilter: PriceRangeFilter): GoodsListItemType[] {
  console.log('========================================');
  console.log('=== 开始价格区间筛选 ===');
  console.log(`价格区间: ¥${priceFilter.minPrice} - ¥${priceFilter.maxPrice}`);
  console.log(`筛选前商品数量: ${goodsList.length}`);

  // 打印筛选前的商品信息
  console.log('\n【筛选前的商品列表】');
  goodsList.forEach((item, index) => {
    const price = parsePrice(item.price);
    console.log(`  [${index + 1}] ID: ${item.id}, 名称: ${item.goodsName.toString().substring(0, 30)}..., 价格: ${price}`);
  });

  // 进行价格区间筛选
  const filteredList = goodsList.filter(item => {
    const price = parsePrice(item.price);
    const isInRange = price >= priceFilter.minPrice && price <= priceFilter.maxPrice;
    
    console.log(`  [筛选] 商品ID: ${item.id}, 价格: ${price}, 在区间内: ${isInRange}`);
    
    return isInRange;
  });

  console.log(`\n筛选后商品数量: ${filteredList.length}`);
  console.log('=== 价格区间筛选完成 ===');
  console.log('========================================\n');

  return filteredList;
}

/**
 * 对商品列表进行排序和筛选
 * @param goodsList 商品列表
 * @param sortType 排序类型
 * @param priceFilter 价格区间筛选条件（可选）
 * @returns 排序和筛选后的商品列表
 */
export function sortGoodsList(goodsList: GoodsListItemType[], sortType: SortType, priceFilter?: PriceRangeFilter): GoodsListItemType[] {
  console.log('========================================');
  console.log('=== 开始排序商品列表 ===');
  console.log(`排序类型: ${sortType}`);
  console.log(`价格筛选: ${priceFilter ? `¥${priceFilter.minPrice} - ¥${priceFilter.maxPrice}` : '无'}`);
  console.log(`排序前商品数量: ${goodsList.length}`);
  
  // 打印排序前的商品信息
  console.log('\n【排序前的商品列表】');
  goodsList.forEach((item, index) => {
    const price = parsePrice(item.price);
    console.log(`  [${index + 1}] ID: ${item.id}, 名称: ${item.goodsName.substring(0, 30)}..., 价格: ${item.price.toString()}, 解析后价格: ${price}`);
  });
  
  // 创建新数组，避免修改原数组
  let processedList = [...goodsList];

  // 首先进行价格区间筛选
  if (priceFilter) {
    console.log('\n【价格区间筛选】开始筛选...');
    processedList = filterGoodsByPriceRange(processedList, priceFilter);
    console.log(`筛选后商品数量: ${processedList.length}`);
  }

  switch (sortType) {
    case SortType.RECOMMEND:
      // 推荐排序：保持原始顺序（随机顺序）
      console.log('\n【排序结果】推荐排序，保持原始顺序');
      break;

    case SortType.PRICE_LOW_TO_HIGH:
      // 价格从低到高
      console.log('\n【排序过程】价格从低到高排序');
      processedList.sort((a, b) => {
        const priceA = parsePrice(a.price);
        const priceB = parsePrice(b.price);
        const result = priceA - priceB;
        if (result === 0) {
          console.warn(`  [排序警告] 商品ID ${a.id} 和 ${b.id} 价格相同 (${priceA})`);
        }
        return result;
      });
      break;

    case SortType.PRICE_HIGH_TO_LOW:
      // 价格从高到低
      console.log('\n【排序过程】价格从高到低排序');
      processedList.sort((a, b) => {
        const priceA = parsePrice(a.price);
        const priceB = parsePrice(b.price);
        const result = priceB - priceA;
        if (result === 0) {
          console.warn(`  [排序警告] 商品ID ${a.id} 和 ${b.id} 价格相同 (${priceA})`);
        }
        return result;
      });
      break;

    case SortType.PRICE_RANGE:
      // 价格区间筛选：不需要额外排序，保持价格区间内的顺序
      console.log('\n【排序结果】价格区间筛选，不进行额外排序');
      break;

    default:
      console.log('\n【排序结果】未知排序类型，保持原始顺序');
      break;
  }
  
  // 打印排序后的商品信息
  console.log('\n【排序后的商品列表】');
  processedList.forEach((item, index) => {
    const price = parsePrice(item.price);
    // 尝试安全地获取价格字符串用于显示
    let priceDisplay = '';
    try {
      if (typeof item.price === 'string') {
        priceDisplay = item.price;
      } else {
        const priceObj = item.price as ResourceStrInternal;
        priceDisplay = String(priceObj.value || item.price);
      }
    } catch (e) {
      priceDisplay = '[无法显示]';
    }
    console.log(`  [${index + 1}] ID: ${item.id}, 名称: ${item.goodsName.substring(0, 30)}..., 价格显示: ${priceDisplay}, 解析后价格: ${price}`);
  });
  
  // 验证排序结果
  if (sortType === SortType.PRICE_LOW_TO_HIGH) {
    console.log('\n【排序验证】价格从低到高');
    for (let i = 1; i < processedList.length; i++) {
      const prevPrice = parsePrice(processedList[i - 1].price);
      const currPrice = parsePrice(processedList[i].price);
      if (prevPrice > currPrice) {
        console.error(`  [排序错误] 位置 ${i} 和 ${i + 1} 顺序错误: ${prevPrice} > ${currPrice}`);
      }
    }
  } else if (sortType === SortType.PRICE_HIGH_TO_LOW) {
    console.log('\n【排序验证】价格从高到低');
    for (let i = 1; i < processedList.length; i++) {
      const prevPrice = parsePrice(processedList[i - 1].price);
      const currPrice = parsePrice(processedList[i].price);
      if (prevPrice < currPrice) {
        console.error(`  [排序错误] 位置 ${i} 和 ${i + 1} 顺序错误: ${prevPrice} < ${currPrice}`);
      }
    }
  }
  
  console.log(`最终商品数量: ${processedList.length}`);
  console.log('=== 排序完成 ===');
  console.log('========================================\n');
  
  return processedList;
}

