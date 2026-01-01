import { CATEGORIES, getAllGoods } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/InitialData";
import type { GoodsListItemType } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/InitialData";
// 简单的搜索缓存
const searchCache = new Map<string, GoodsListItemType[]>();
// 随机打乱数组
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = temp;
    }
    return newArray;
}
// 简单的字符串包含匹配
function isMatch(itemName: string, keyword: string): boolean {
    if (!keyword || keyword.trim() === '') {
        return false;
    }
    const processedItemName = itemName.toLowerCase();
    const processedKeyword = keyword.toLowerCase().trim();
    console.log('匹配检查:', '商品名称:', itemName, '关键词:', processedKeyword);
    // 完全匹配
    if (processedItemName === processedKeyword) {
        console.log('完全匹配');
        return true;
    }
    // 包含匹配
    if (processedItemName.includes(processedKeyword)) {
        console.log('包含匹配');
        return true;
    }
    // 前缀匹配
    if (processedItemName.startsWith(processedKeyword)) {
        console.log('前缀匹配');
        return true;
    }
    return false;
}
// 根据关键词搜索商品
export function searchGoodsByKeyword(category: string, keyword: string): GoodsListItemType[] {
    const allGoods = getAllGoods();
    // 空关键词时返回对应分类的所有商品
    if (!keyword || keyword.trim() === '') {
        if (category === CATEGORIES.SELECTED) {
            // 精选页：显示所有商品（打乱顺序）
            return shuffleArray(allGoods);
        }
        else {
            // 其他分类：显示对应分类的所有商品
            return allGoods.filter(item => item.category === category);
        }
    }
    // 生成缓存键
    const cacheKey = `${category}_${keyword.toLowerCase().trim()}`;
    // 检查缓存
    if (searchCache.has(cacheKey)) {
        console.log('使用缓存搜索结果:', cacheKey, searchCache.get(cacheKey)!.length);
        return searchCache.get(cacheKey)!;
    }
    // 先根据分类筛选商品
    const categoryGoods = category === CATEGORIES.SELECTED
        ? allGoods
        : allGoods.filter(item => item.category === category);
    // 简单的字符串匹配
    const searchResults = categoryGoods.filter(item => {
        return isMatch(item.goodsName, keyword);
    });
    // 缓存搜索结果（限制缓存大小）
    if (searchCache.size > 20) {
        const cacheIterator = searchCache.keys();
        const firstResult = cacheIterator.next();
        if (!firstResult.done && firstResult.value) {
            searchCache.delete(firstResult.value);
        }
    }
    searchCache.set(cacheKey, searchResults);
    console.log('搜索结果:', keyword, searchResults.length, '个商品');
    return searchResults;
}
// 清除搜索缓存
export function clearSearchCache(): void {
    searchCache.clear();
    console.log('搜索缓存已清除');
}
// 获取搜索建议
export function getSearchSuggestions(keyword: string, limit: number = 5): string[] {
    if (!keyword || keyword.trim().length < 1) {
        return [];
    }
    const allGoods = getAllGoods();
    const suggestions = new Set<string>();
    const processedKeyword = keyword.toLowerCase().trim();
    // 提取商品名称中的关键词作为建议
    for (const item of allGoods) {
        const itemName = item.goodsName.toString();
        const words = itemName.split(/\s+/);
        for (const word of words) {
            const cleanWord = word.toLowerCase();
            if (cleanWord.length >= 2 && cleanWord.includes(processedKeyword)) {
                suggestions.add(cleanWord);
                if (suggestions.size >= limit) {
                    break;
                }
            }
        }
        if (suggestions.size >= limit) {
            break;
        }
    }
    return Array.from(suggestions).slice(0, limit);
}
