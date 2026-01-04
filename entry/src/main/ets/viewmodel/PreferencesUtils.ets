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

import { SortType } from '../view/SortDialogComponent';

const SORT_TYPE_KEY = 'sort_type';

/**
 * 保存排序类型
 * 使用AppStorage进行持久化存储
 */
export function saveSortType(sortType: SortType): void {
  try {
    AppStorage.setOrCreate(SORT_TYPE_KEY, sortType);
    console.log('排序类型已保存:', sortType);
  } catch (error) {
    console.error('保存排序类型失败:', error);
  }
}

/**
 * 获取排序类型
 * 从AppStorage读取保存的排序类型
 */
export function getSortType(): SortType {
  try {
    const storedType = AppStorage.get<SortType>(SORT_TYPE_KEY);
    if (storedType) {
      console.log('获取排序类型:', storedType);
      return storedType;
    }
    return SortType.RECOMMEND;
  } catch (error) {
    console.error('获取排序类型失败:', error);
    return SortType.RECOMMEND;
  }
}

