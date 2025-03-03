import { getDict } from '@/api/dict';
import { reactive } from 'vue';

interface Dict {
  label: string
  value: string
  [key: string]: any
}

const dictStore = reactive<Record<string, Dict[]>>({});

/**
 * 使用给定的类型数组初始化字典数据
 *
 * 此函数旨在为提供的类型数组中的每个类型获取和存储字典数据它在组件挂载时自动获取数据，
 * 并确保每个类型的数据只被获取一次如果数据已经存在，则不会重复请求
 *
 * @param types - 一个字符串数组，表示需要初始化字典数据的类型
 * @returns 返回一个对象，其中包含初始化后的字典数据，键为类型，值为对应的数据列表
 */
export function useDict<T extends string[]>(types: [...T]): Record<T[number], Dict[]> {
  const a = 1
  // 在组件挂载后，为每个类型获取字典数据
  types.forEach(async (type) => {
    // 检查字典数据是否已经存在，如果不存在则发起请求
    if (!dictStore[type]) {
      const res = await getDict({ type });
      // 如果请求成功，将数据存储在字典中
      if (res && res.data) {
        dictStore[type] = res.data;
      }
    }
  });

  // 返回初始化后的字典数据对象
  return dictStore
}
