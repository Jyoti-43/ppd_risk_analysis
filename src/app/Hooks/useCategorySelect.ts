import { useEffect, useState } from "react";
import {
  useCreateCategoryMutation,
  useGetCategoryQuery,
} from "@/src/app/redux/services/communityPostApi";

export interface Category {
  value: string;
  label: string;
}

export function useCategorySelect() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoryQuery();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();

  useEffect(() => {
    if (categoriesData) {
      let catArray: any[] = [];
      if (Array.isArray(categoriesData)) {
        catArray = categoriesData;
      } else if (categoriesData?.data && Array.isArray(categoriesData.data)) {
        catArray = categoriesData.data;
      }
      const mapped: Category[] = catArray.map((c: any) => ({
        value: c.id ?? c._id ?? c.categoryId ?? c.value,
        label: c.name ?? c.label ?? c.categoryName ?? c.title,
      }));
      setCategories(mapped);
    }
  }, [categoriesData]);

  const handleCategoryChange = async (newValue: any) => {
    if (!newValue) {
      setSelectedCategory(null);
      return;
    }
    if (newValue.__isNew__) {
      try {
        const res: any = await createCategory({
          name: newValue.label,
        }).unwrap();
        const createdCategory: Category = {
          value:
            res?.id ??
            res?._id ??
            res?.categoryId ??
            res?.data?.id ??
            res?.data?._id ??
            newValue.label.toLowerCase().replace(/\s+/g, "-"),
          label: res?.name ?? res?.data?.name ?? newValue.label,
        };
        setCategories((prev) => [...prev, createdCategory]);
        setSelectedCategory(createdCategory);
      } catch (error: any) {
        // fallback
        const fallback: Category = {
          value: newValue.label.toLowerCase().replace(/\s+/g, "-"),
          label: newValue.label,
        };
        setCategories((prev) => [...prev, fallback]);
        setSelectedCategory(fallback);
      }
      return;
    }
    setSelectedCategory(newValue);
  };

  return {
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
    handleCategoryChange,
    categoriesLoading,
    isCreatingCategory,
  };
}
