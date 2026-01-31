import { useState, useEffect, useRef } from "react";
import { Icon } from "@/components/common/Icon";
import { CustomInput, CustomSelect, CustomSelectItem, CustomRadio, OrangeButton, FileUpload, type FileUploadItem } from "@/components/common";
import { AutoComplete } from "@/components/common/AutoComplete";
import { CustomTextarea } from "@/components/common/CustomTextarea";
import { DatePicker } from "@/components/common/DatePicker";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import type { WeightUnit, Gender, PetType, Behavior, CoatCondition } from "@/components/booking/bookingStore";
import { ReferenceStylesUpload } from "@/components/booking/ReferenceStylesUpload";
import type { PetBreedOut } from "@/lib/api";
import { uploadPetPhoto, uploadReferencePhoto, buildImageUrl } from "@/lib/api";

function getBreedOptions(petType: PetType, breeds: PetBreedOut[]): string[] {
  return breeds
    .filter((breed) => breed.pet_type === petType)
    .map((breed) => breed.breed)
    .sort();
}

export interface PetFormProps {
  petName: string;
  petType: PetType;
  breed: string;
  isMixedBreed: boolean;
  precisePetType: string;
  dateOfBirth: string;
  gender: Gender | "";
  weight: string;
  weightUnit: WeightUnit;
  coatCondition: CoatCondition | "";
  approveShave: boolean | null;
  behavior: Behavior | "";
  groomingFrequency: string;
  specialNotes: string;
  petBreeds: PetBreedOut[];
  isLoadingBreeds: boolean;
  photoIds: number[];
  photoUrls: string[];
  referencePhotoIds: number[];
  referencePhotoUrls: string[];
  petPhoto: File | null;
  referenceStyles: File[];
  setPetName: (value: string) => void;
  setPetType: (value: PetType) => void;
  setBreed: (value: string) => void;
  setIsMixedBreed: (value: boolean) => void;
  setPrecisePetType: (value: string) => void;
  setDateOfBirth: (value: string) => void;
  setGender: (value: Gender | "") => void;
  setWeight: (value: string) => void;
  setWeightUnit: (value: WeightUnit) => void;
  setCoatCondition: (value: CoatCondition | "") => void;
  setApproveShave: (value: boolean | null) => void;
  setBehavior: (value: Behavior | "") => void;
  setGroomingFrequency: (value: string) => void;
  setSpecialNotes: (value: string) => void;
  setPhotoIds: (value: number[]) => void;
  setReferencePhotoIds: (value: number[]) => void;
  setPhotoUrls: (value: string[]) => void;
  setReferencePhotoUrls: (value: string[]) => void;
  setPetPhoto: (value: File | null) => void;
  setReferenceStyles: (value: File[]) => void;
  primaryActionLabel?: string;
  isPrimaryActionLoading?: boolean;
  onPrimaryAction?: () => void;
  showBackButton?: boolean;
  backLabel?: string;
  onBackAction?: () => void;
}

export function PetForm({
  petName,
  petType,
  breed,
  isMixedBreed,
  precisePetType,
  dateOfBirth,
  gender,
  weight,
  weightUnit,
  coatCondition,
  approveShave,
  behavior,
  groomingFrequency,
  specialNotes,
  petBreeds,
  isLoadingBreeds,
  photoIds,
  photoUrls,
  referencePhotoIds,
  referencePhotoUrls,
  petPhoto,
  referenceStyles,
  setPetName,
  setPetType,
  setBreed,
  setIsMixedBreed,
  setPrecisePetType,
  setDateOfBirth,
  setGender,
  setWeight,
  setWeightUnit,
  setCoatCondition,
  setApproveShave,
  setBehavior,
  setGroomingFrequency,
  setSpecialNotes,
  setPhotoIds,
  setReferencePhotoIds,
  setPhotoUrls,
  setReferencePhotoUrls,
  setPetPhoto,
  setReferenceStyles,
  primaryActionLabel,
  isPrimaryActionLoading = false,
  onPrimaryAction,
  showBackButton = true,
  backLabel = "Back",
  onBackAction,
}: PetFormProps) {

  // 计算日期限制：最多20年前的今天，不能超过今天
  const today = new Date();
  const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  
  const minDateObj = new Date(today);
  minDateObj.setFullYear(today.getFullYear() - 20);
  const minDate = `${minDateObj.getFullYear()}-${String(minDateObj.getMonth() + 1).padStart(2, "0")}`;
  const handlePrimaryAction = onPrimaryAction ?? (() => {});
  const handleBackAction = onBackAction ?? (() => {});
  const primaryLabel = primaryActionLabel ?? "Continue";

  const photoIdsRef = useRef(photoIds);
  const photoUrlsRef = useRef(photoUrls);
  const referencePhotoIdsRef = useRef(referencePhotoIds);
  const referencePhotoUrlsRef = useRef(referencePhotoUrls);

  useEffect(() => {
    photoIdsRef.current = photoIds;
  }, [photoIds]);

  useEffect(() => {
    photoUrlsRef.current = photoUrls;
  }, [photoUrls]);

  useEffect(() => {
    referencePhotoIdsRef.current = referencePhotoIds;
  }, [referencePhotoIds]);

  useEffect(() => {
    referencePhotoUrlsRef.current = referencePhotoUrls;
  }, [referencePhotoUrls]);

  // 初始化图片状态（使用函数式初始化确保每次挂载都读取最新值）
  const [petPhotoItems, setPetPhotoItems] = useState<FileUploadItem[]>(() => {
    const initialPetPhoto = petPhoto;
    const initialPhotoIds = photoIds;
    const initialPhotoUrls = photoUrls;
    
    // 如果图片已上传（有 photoId 和 photoUrl），即使 petPhoto 为 null 也要恢复显示
    if (initialPhotoIds.length > 0 && initialPhotoUrls.length > 0) {
      // 创建一个占位符 File 对象（因为 FileUploadItem 接口要求 file: File）
      // 这个 File 对象不会被使用，因为预览会使用服务器 URL
      const placeholderFile = initialPetPhoto || new File([], "placeholder.jpg", { type: "image/jpeg" });
      const previewUrl = buildImageUrl(initialPhotoUrls[0]);
      
      const item: FileUploadItem = {
        file: placeholderFile,
        previewUrl,
        uploadStatus: "uploaded",
        uploadProgress: 100,
        photoId: initialPhotoIds[0],
        serverUrl: initialPhotoUrls[0],
      };
      return [item];
    }
    
    // 如果只有 petPhoto 但没有上传，使用 File 对象的 blob URL
    if (initialPetPhoto) {
      const previewUrl = URL.createObjectURL(initialPetPhoto);
      const item: FileUploadItem = {
        file: initialPetPhoto,
        previewUrl,
        uploadStatus: "uploading",
        uploadProgress: 0,
      };
      return [item];
    }
    
    return [];
  });

  const [referenceStyleItems, setReferenceStyleItems] = useState<FileUploadItem[]>(() => {
    const initialReferenceStyles = referenceStyles;
    const initialReferencePhotoIds = referencePhotoIds;
    const initialReferencePhotoUrls = referencePhotoUrls;
    
    // 优先使用已上传的图片（即使 referenceStyles 为空）
    const maxLength = Math.max(initialReferenceStyles.length, initialReferencePhotoIds.length, initialReferencePhotoUrls.length);
    if (maxLength === 0) return [];
    
    return Array.from({ length: maxLength }, (_, index): FileUploadItem => {
      // 如果图片已上传（有 photoId 和 photoUrl），使用服务器 URL
      if (initialReferencePhotoIds[index] !== undefined && initialReferencePhotoUrls[index]) {
        // 创建一个占位符 File 对象（因为 FileUploadItem 接口要求 file: File）
        const placeholderFile = initialReferenceStyles[index] || new File([], `placeholder-${index}.jpg`, { type: "image/jpeg" });
        const previewUrl = buildImageUrl(initialReferencePhotoUrls[index]);
        
        return {
          file: placeholderFile,
          previewUrl,
          uploadStatus: "uploaded",
          uploadProgress: 100,
          photoId: initialReferencePhotoIds[index],
          serverUrl: initialReferencePhotoUrls[index],
        };
      }
      
      // 如果只有 File 对象但没有上传，使用 File 对象的 blob URL
      if (initialReferenceStyles[index]) {
        const previewUrl = URL.createObjectURL(initialReferenceStyles[index]);
        return {
          file: initialReferenceStyles[index],
          previewUrl,
          uploadStatus: "uploading",
          uploadProgress: 0,
        };
      }
      
      // 理论上不应该到这里，但为了类型安全返回一个占位符
      const placeholderFile = new File([], `placeholder-${index}.jpg`, { type: "image/jpeg" });
      return {
        file: placeholderFile,
        previewUrl: "",
        uploadStatus: "uploading",
        uploadProgress: 0,
      };
    });
  });
  const previousPetTypeRef = useRef(petType);
  const [behaviorModal, setBehaviorModal] = useState<"hard_to_handle" | "senior_pets" | null>(null);
  const [mattingModalOpen, setMattingModalOpen] = useState(false);
  const [approveShaveSelection, setApproveShaveSelection] = useState<boolean | null>(approveShave ?? null);

  const handleBehaviorSelect = (nextBehavior: Behavior) => {
    setBehavior(nextBehavior);
    if (nextBehavior === "hard_to_handle" || nextBehavior === "senior_pets") {
      (document.activeElement as HTMLElement)?.blur?.();
      setBehaviorModal(nextBehavior);
    }
  };

  const handleCoatConditionSelect = (nextCondition: CoatCondition) => {
    setCoatCondition(nextCondition);
    if (nextCondition === "matted" || nextCondition === "severely_matted") {
      (document.activeElement as HTMLElement)?.blur?.();
      setMattingModalOpen(true);
    } else {
      setApproveShave(null);
    }
  };

  const handleMattingSubmit = () => {
    if (approveShaveSelection === null) return;
    setApproveShave(approveShaveSelection);
    setMattingModalOpen(false);
  };

  const [petPhotoFiles, setPetPhotoFiles] = useState<File[]>(() => {
    return petPhoto ? [petPhoto] : [];
  });

  const [referenceStyleFiles, setReferenceStyleFiles] = useState<File[]>(() => {
    return referenceStyles;
  });


  useEffect(() => {
    if (mattingModalOpen) {
      setApproveShaveSelection(approveShave ?? null);
    }
  }, [mattingModalOpen, approveShave]);

  // 从外部状态恢复图片（当 photoIds 或 photoUrls 变化时检查并恢复）
  // 这个 useEffect 确保外部状态和 petPhotoItems 保持同步
  useEffect(() => {
    // 恢复宠物照片：如果外部状态中有数据，但 petPhotoItems 为空或不匹配
    if (photoIds.length > 0 && photoUrls.length > 0) {
      setPetPhotoItems((prevItems) => {
        // 获取当前 petPhotoItems 中的所有 photoId
        const currentPhotoIds = prevItems
          .map((item) => item.photoId)
          .filter((id): id is number => id !== undefined);
        
        // 检查是否需要恢复（如果 photoIds 和 currentPhotoIds 不匹配）
        // 只有当外部状态中的 photoIds 比 petPhotoItems 中的多时，才需要恢复
        // 这样可以避免在删除后重新恢复已删除的图片
        const needsRestore = 
          photoIds.length > currentPhotoIds.length ||
          photoIds.some((id) => !currentPhotoIds.includes(id));
        
        if (needsRestore) {
          // 恢复所有图片（不仅仅是第一个）
          // 但只恢复那些不在当前 petPhotoItems 中的图片
          const restoredItems: FileUploadItem[] = photoIds
            .filter((photoId) => !currentPhotoIds.includes(photoId))
            .map((photoId): FileUploadItem => {
              const photoIndex = photoIds.indexOf(photoId);
              const placeholderFile = new File([], `placeholder-${photoId}.jpg`, { type: "image/jpeg" });
              const previewUrl = buildImageUrl(photoUrls[photoIndex]);
              
              return {
                file: placeholderFile,
                previewUrl,
                uploadStatus: "uploaded",
                uploadProgress: 100,
                photoId,
                serverUrl: photoUrls[photoIndex],
              };
            });
          
          // 合并当前 items 和新恢复的 items
          return [...prevItems, ...restoredItems];
        } else if (photoIds.length < currentPhotoIds.length) {
          // 如果外部状态中的 photoIds 比 petPhotoItems 中的少，说明有图片被删除
          // 移除那些不在外部状态中的图片
          return prevItems.filter((item) => {
            if (item.photoId === undefined) {
              // 保留未上传的图片
              return true;
            }
            // 只保留在外部状态中的已上传图片
            return photoIds.includes(item.photoId);
          });
        }
        return prevItems;
      });
    } else if (photoIds.length === 0 && photoUrls.length === 0) {
      setPetPhotoItems((prevItems) => {
        // 如果外部状态中没有数据，但 petPhotoItems 有数据，清空（可能是状态不一致）
        // 但只清空未上传的项，保留已上传的（以防万一）
        const uploadedItems = prevItems.filter(item => item.photoId !== undefined);
        if (uploadedItems.length !== prevItems.length) {
          return uploadedItems;
        }
        return prevItems;
      });
    }
    
    // 恢复参考照片：如果外部状态中有数据，但 referenceStyleItems 为空或不匹配
    if (referencePhotoIds.length > 0 && referencePhotoUrls.length > 0) {
      setReferenceStyleItems((prevItems) => {
        const currentReferenceIds = prevItems.map(item => item.photoId).filter((id): id is number => id !== undefined);
        const storeReferenceIds = referencePhotoIds;
        
        // 只有当外部状态中的 referencePhotoIds 比 referenceStyleItems 中的多时，才需要恢复
        const needsRestore = 
          storeReferenceIds.length > currentReferenceIds.length ||
          storeReferenceIds.some(id => !currentReferenceIds.includes(id));
        
        if (needsRestore) {
          // 只恢复那些不在当前 referenceStyleItems 中的图片
          const restoredItems = referencePhotoIds
            .filter((photoId) => !currentReferenceIds.includes(photoId))
            .map((photoId): FileUploadItem => {
              const photoIndex = referencePhotoIds.indexOf(photoId);
              const placeholderFile = new File([], `placeholder-${photoId}.jpg`, { type: "image/jpeg" });
              const previewUrl = buildImageUrl(referencePhotoUrls[photoIndex]);
              
              return {
                file: placeholderFile,
                previewUrl,
                uploadStatus: "uploaded",
                uploadProgress: 100,
                photoId,
                serverUrl: referencePhotoUrls[photoIndex],
              };
            });
          
          // 合并当前 items 和新恢复的 items
          return [...prevItems, ...restoredItems];
        } else if (storeReferenceIds.length < currentReferenceIds.length) {
          // 如果外部状态中的 referencePhotoIds 比 referenceStyleItems 中的少，说明有图片被删除
          // 移除那些不在外部状态中的图片
          return prevItems.filter((item) => {
            if (item.photoId === undefined) {
              // 保留未上传的图片
              return true;
            }
            // 只保留在外部状态中的已上传图片
            return storeReferenceIds.includes(item.photoId);
          });
        }
        return prevItems;
      });
    } else if (referencePhotoIds.length === 0 && referencePhotoUrls.length === 0) {
      setReferenceStyleItems((prevItems) => {
        // 如果外部状态中没有数据，但 referenceStyleItems 有数据，清空（可能是状态不一致）
        // 但只清空未上传的项，保留已上传的（以防万一）
        const uploadedItems = prevItems.filter(item => item.photoId !== undefined);
        if (uploadedItems.length !== prevItems.length) {
          return uploadedItems;
        }
        return prevItems;
      });
    }
  }, [photoIds, photoUrls, referencePhotoIds, referencePhotoUrls]);

  // 真实上传函数 - 上传宠物照片
  // 预加载远程图片，避免从 blob URL 切换到远程 URL 时闪烁
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  };

  const uploadPetPhotoFile = async (
    file: File,
    index: number,
    setItems: React.Dispatch<React.SetStateAction<FileUploadItem[]>>,
    items: FileUploadItem[]
  ) => {
    // 使用已存在的 item（包含 previewUrl），只更新上传状态
    const existingItem = items[index];
    if (!existingItem) {
      console.error("Item not found at index", index);
      return;
    }

    // 确保上传状态为 uploading
    setItems((prevItems) => {
      const currentItems = [...prevItems];
      if (currentItems[index]) {
        currentItems[index] = {
          ...currentItems[index],
          uploadStatus: "uploading",
          uploadProgress: 0,
        };
      }
      return currentItems;
    });

    try {
      // 调用真实 API 上传，传入进度回调
      const response = await uploadPetPhoto(file, (progress) => {
        // 更新上传进度
        setItems((prevItems) => {
          const currentItems = [...prevItems];
          if (currentItems[index]) {
            currentItems[index] = {
              ...currentItems[index],
              uploadProgress: progress,
            };
          }
          return currentItems;
        });
      });
      
      // 上传成功，先预加载远程图片，等加载完成后再更新 previewUrl，避免闪烁
      const fullServerUrl = buildImageUrl(response.url);
      
      // 先更新 petPhotoItems 中的 photoId，防止 useEffect 重复添加
      // 然后再预加载远程图片，加载完成后再更新 previewUrl
      setItems((prevItems) => {
        const currentItems = [...prevItems];
        if (currentItems[index]) {
          currentItems[index] = {
            ...currentItems[index],
            uploadStatus: "uploaded",
            uploadProgress: 100,
            photoId: response.id, // 先设置 photoId，防止 useEffect 重复添加
            serverUrl: response.url, // 保存服务器返回的相对路径 URL
            // previewUrl 暂时保持 blob URL，等预加载完成后再更新
          };
        }
        return currentItems;
      });
      
      // 更新 photoIds 和 photoUrls（在设置 photoId 之后，避免 useEffect 重复添加）
      const currentPhotoIds = photoIdsRef.current;
      const currentPhotoUrls = photoUrlsRef.current;
      if (response.id && !currentPhotoIds.includes(response.id)) {
        setPhotoIds([...currentPhotoIds, response.id]);
        setPhotoUrls([...currentPhotoUrls, response.url]);
      }
      
      // 预加载远程图片，加载完成后再更新 previewUrl
      preloadImage(fullServerUrl)
        .then(() => {
          // 远程图片加载完成，更新 previewUrl
          setItems((prevItems) => {
            const currentItems = [...prevItems];
            if (currentItems[index] && currentItems[index].photoId === response.id) {
              currentItems[index] = {
                ...currentItems[index],
                previewUrl: fullServerUrl, // 使用服务器 URL 作为预览 URL
              };
            }
            return currentItems;
          });
        })
        .catch((error) => {
          console.warn("Failed to preload remote image, using server URL anyway:", error);
          // 即使预加载失败，也更新为远程 URL（可能网络问题，但图片可能仍然可用）
          setItems((prevItems) => {
            const currentItems = [...prevItems];
            if (currentItems[index] && currentItems[index].photoId === response.id) {
              currentItems[index] = {
                ...currentItems[index],
                previewUrl: fullServerUrl,
              };
            }
            return currentItems;
          });
        });
    } catch (error) {
      console.error("Failed to upload pet photo:", error);
      // 上传失败
      setItems((prevItems) => {
        const currentItems = [...prevItems];
        if (currentItems[index]) {
          currentItems[index] = {
            ...currentItems[index],
            uploadStatus: "error",
            errorType: "upload",
          };
        }
        return currentItems;
      });
    }
    // 注意：不在这里清理 previewUrl，因为上传成功后还需要显示预览
    // previewUrl 会在文件被删除时通过 handlePetPhotoChange 清理
  };

  // 真实上传函数 - 上传参考照片
  const uploadReferencePhotoFile = async (
    file: File,
    index: number,
    setItems: React.Dispatch<React.SetStateAction<FileUploadItem[]>>,
    items: FileUploadItem[]
  ) => {
    // 使用已存在的 item（包含 previewUrl），只更新上传状态
    const existingItem = items[index];
    if (!existingItem) {
      console.error("Item not found at index", index);
      return;
    }

    // 确保上传状态为 uploading
    setItems((prevItems) => {
      const currentItems = [...prevItems];
      if (currentItems[index]) {
        currentItems[index] = {
          ...currentItems[index],
          uploadStatus: "uploading",
          uploadProgress: 0,
        };
      }
      return currentItems;
    });

    try {
      // 调用真实 API 上传，传入进度回调
      const response = await uploadReferencePhoto(file, (progress) => {
        // 更新上传进度
        setItems((prevItems) => {
          const currentItems = [...prevItems];
          if (currentItems[index]) {
            currentItems[index] = {
              ...currentItems[index],
              uploadProgress: progress,
            };
          }
          return currentItems;
        });
      });
      
      // 上传成功，先预加载远程图片，等加载完成后再更新 previewUrl，避免闪烁
      const fullServerUrl = buildImageUrl(response.url);
      
      // 先更新 referenceStyleItems 中的 photoId，防止 useEffect 重复添加
      // 然后再预加载远程图片，加载完成后再更新 previewUrl
      setItems((prevItems) => {
        const currentItems = [...prevItems];
        if (currentItems[index]) {
          currentItems[index] = {
            ...currentItems[index],
            uploadStatus: "uploaded",
            uploadProgress: 100,
            photoId: response.id, // 先设置 photoId，防止 useEffect 重复添加
            serverUrl: response.url, // 保存服务器返回的相对路径 URL
            // previewUrl 暂时保持 blob URL，等预加载完成后再更新
          };
        }
        return currentItems;
      });
      
      // 更新 referencePhotoIds 和 referencePhotoUrls（在设置 photoId 之后，避免 useEffect 重复添加）
      const currentReferencePhotoIds = referencePhotoIdsRef.current;
      const currentReferencePhotoUrls = referencePhotoUrlsRef.current;
      if (response.id && !currentReferencePhotoIds.includes(response.id)) {
        setReferencePhotoIds([...currentReferencePhotoIds, response.id]);
        setReferencePhotoUrls([...currentReferencePhotoUrls, response.url]);
      }
      
      // 预加载远程图片，加载完成后再更新 previewUrl
      preloadImage(fullServerUrl)
        .then(() => {
          // 远程图片加载完成，更新 previewUrl
          setItems((prevItems) => {
            const currentItems = [...prevItems];
            if (currentItems[index] && currentItems[index].photoId === response.id) {
              currentItems[index] = {
                ...currentItems[index],
                previewUrl: fullServerUrl, // 使用服务器 URL 作为预览 URL
              };
            }
            return currentItems;
          });
        })
        .catch((error) => {
          console.warn("Failed to preload remote image, using server URL anyway:", error);
          // 即使预加载失败，也更新为远程 URL（可能网络问题，但图片可能仍然可用）
          setItems((prevItems) => {
            const currentItems = [...prevItems];
            if (currentItems[index] && currentItems[index].photoId === response.id) {
              currentItems[index] = {
                ...currentItems[index],
                previewUrl: fullServerUrl,
              };
            }
            return currentItems;
          });
        });
    } catch (error) {
      console.error("Failed to upload reference photo:", error);
      // 上传失败
      setItems((prevItems) => {
        const currentItems = [...prevItems];
        if (currentItems[index]) {
          currentItems[index] = {
            ...currentItems[index],
            uploadStatus: "error",
            errorType: "upload",
          };
        }
        return currentItems;
      });
    }
    // 注意：不在这里清理 previewUrl，因为上传成功后还需要显示预览
    // previewUrl 会在文件被删除时通过 handleReferenceStylesChange 清理
  };

  const handlePetPhotoChange = async (files: File[]) => {
    // 获取当前已上传的图片（确保与当前状态同步）
    const currentPhotoIds = photoIdsRef.current;
    const currentPhotoUrls = photoUrlsRef.current;
    
    // 关键修复：只处理新增的文件（不在 petPhotoFiles 中的文件）
    // 这样可以避免在追加模式下重复上传已上传的图片
    const previousFiles = petPhotoFiles;
    const newFilesFromInput = files.filter((file) => !previousFiles.includes(file));
    
    // 更新 petPhotoFiles（只包含用户选择的 File 对象，不包含已上传的图片）
    // 注意：已上传的图片使用占位符 File，不应该在 petPhotoFiles 中
    const realFiles = files.filter((file) => !(file.size === 0 && file.name.includes("placeholder")));
    setPetPhotoFiles(realFiles);
    
    // 同步到外部状态（只同步第一个文件，用于兼容性）
    setPetPhoto(realFiles.length > 0 ? realFiles[0] : null);
    
    // 从外部状态构建已上传的图片项
    const uploadedItems: FileUploadItem[] = currentPhotoIds.map((photoId, index): FileUploadItem => {
      const placeholderFile = new File([], `placeholder-${photoId}.jpg`, { type: "image/jpeg" });
      const previewUrl = buildImageUrl(currentPhotoUrls[index]);
      
      return {
        file: placeholderFile,
        previewUrl,
        uploadStatus: "uploaded",
        uploadProgress: 100,
        photoId,
        serverUrl: currentPhotoUrls[index],
      };
    });
    
    // 获取当前未上传的文件项（从 petPhotoItems 中获取，因为这些是正在上传或待上传的文件）
    const nonUploadedItems = petPhotoItems.filter(
      (item) => item.uploadStatus !== "uploaded" || item.photoId === undefined
    );
    
    if (files.length > 0) {
      // 找出被删除的未上传文件（在 nonUploadedItems 中但不在 files 中）
      const remainingNonUploadedItems: FileUploadItem[] = [];
      
      nonUploadedItems.forEach((item) => {
        if (files.includes(item.file)) {
          // 文件还在，保留
          remainingNonUploadedItems.push(item);
        } else {
          // 文件被删除，清理 blob URL
          if (item.previewUrl && item.previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(item.previewUrl);
          }
        }
      });
      
      // 区分新文件和已存在的文件
      // 关键修复：只处理新增的文件（newFilesFromInput），避免重复上传
      const newFiles: File[] = [];
      const existingItems: FileUploadItem[] = [];
      
      // 首先处理已存在的未上传文件（在 files 中且在 remainingNonUploadedItems 中）
      files.forEach((file) => {
        // 跳过占位符 File（已上传的图片）
        if (file.size === 0 && file.name.includes("placeholder")) {
          return;
        }
        
        const existingNonUploadedItem = remainingNonUploadedItems.find((item) => item.file === file);
        if (existingNonUploadedItem) {
          existingItems.push(existingNonUploadedItem);
        }
      });
      
      // 然后只处理新增的文件（newFilesFromInput），避免重复上传已上传的图片
      newFilesFromInput.forEach((file) => {
        // 跳过占位符 File（已上传的图片）
        if (file.size === 0 && file.name.includes("placeholder")) {
          return;
        }
        
        // 检查这个文件是否已经在 petPhotoItems 中（通过 File 对象比较）
        const existingItemInPetPhotoItems = petPhotoItems.find((item) => item.file === file);
        
        if (existingItemInPetPhotoItems) {
          // 文件已经在 petPhotoItems 中
          if (existingItemInPetPhotoItems.uploadStatus === "uploaded" && existingItemInPetPhotoItems.photoId !== undefined) {
            // 已上传的图片，不应该重新上传，跳过
            console.warn("File already uploaded, skipping:", file.name);
            return;
          } else {
            // 正在上传或上传失败的文件，保留现有状态
            existingItems.push(existingItemInPetPhotoItems);
          }
        } else {
          // 真正的新文件，需要上传
          newFiles.push(file);
        }
      });
      
      // 只为新文件创建 items
      const newItems: FileUploadItem[] = newFiles.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        
        // 验证文件
        const fileSizeMB = file.size / (1024 * 1024);
        const fileType = file.type.toLowerCase();
        const isValidType = fileType.startsWith("image/") && 
          (fileType.includes("jpeg") || fileType.includes("jpg") || fileType.includes("png"));

        if (fileSizeMB > 10) {
          return {
            file,
            previewUrl,
            uploadStatus: "error" as const,
            errorType: "size" as const,
          };
        }

        if (!isValidType) {
          return {
            file,
            previewUrl,
            uploadStatus: "error" as const,
            errorType: "format" as const,
          };
        }

        // 开始上传
        return {
          file,
          previewUrl,
          uploadStatus: "uploading" as const,
          uploadProgress: 0,
        };
      });
      
      // 合并：已上传的图片 + 已存在的未上传文件 + 新文件
      const updatedItems: FileUploadItem[] = [
        ...uploadedItems,
        ...existingItems,
        ...newItems,
      ];
      
      setPetPhotoItems(updatedItems);

      // 只为新文件启动真实上传
      newFiles.forEach((file) => {
        const globalIndex = updatedItems.findIndex((item) => item.file === file);
        const item = updatedItems[globalIndex];
        if (item && item.uploadStatus === "uploading") {
          uploadPetPhotoFile(file, globalIndex, setPetPhotoItems, updatedItems);
        }
      });
    } else {
      // files 为空，但可能还有已上传的图片
      // 只清理未上传的文件
      nonUploadedItems.forEach((item) => {
        if (item.previewUrl && item.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
      
      // 如果还有已上传的图片，保留它们；否则清空所有
      if (uploadedItems.length > 0) {
        setPetPhotoItems(uploadedItems);
      } else {
        setPetPhotoItems([]);
        // 清空宠物照片 ID 和 URL
        setPhotoIds([]);
        setPhotoUrls([]);
        // 同步到外部状态
        setPetPhoto(null);
      }
    }
  };

  const handleReferenceStylesChange = async (files: File[]) => {
    setReferenceStyleFiles(files);
    // 同步到外部状态
    setReferenceStyles(files);
    
    if (files.length > 0) {
      // 区分新文件和已存在的文件（支持追加模式）
      const newFiles: File[] = [];
      const existingItems: FileUploadItem[] = [];
      
      files.forEach((file) => {
        const existingItem = referenceStyleItems.find((item) => item.file === file);
        if (existingItem) {
          // 保留已存在的文件状态（包括已上传的文件）
          existingItems.push(existingItem);
        } else {
          // 新文件
          newFiles.push(file);
        }
      });
      
      // 清理被删除的文件预览 URL 和对应的 photo ID
      referenceStyleItems.forEach((item) => {
        if (!files.includes(item.file)) {
          URL.revokeObjectURL(item.previewUrl);
          // 如果文件已上传，从 referencePhotoIds 和 referencePhotoUrls 中移除
          if (item.uploadStatus === "uploaded" && item.photoId) {
            const currentReferencePhotoIds = referencePhotoIdsRef.current;
            const currentReferencePhotoUrls = referencePhotoUrlsRef.current;
            const photoIndex = currentReferencePhotoIds.indexOf(item.photoId);
            setReferencePhotoIds(currentReferencePhotoIds.filter((id) => id !== item.photoId));
            if (photoIndex >= 0) {
              setReferencePhotoUrls(currentReferencePhotoUrls.filter((_, idx) => idx !== photoIndex));
            }
          }
        }
      });

      // 只为新文件创建 items
      const newItems: FileUploadItem[] = newFiles.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        
        // 验证文件
        const fileSizeMB = file.size / (1024 * 1024);
        const fileType = file.type.toLowerCase();
        const isValidType = fileType.startsWith("image/") && 
          (fileType.includes("jpeg") || fileType.includes("jpg") || fileType.includes("png"));

        if (fileSizeMB > 10) {
          return {
            file,
            previewUrl,
            uploadStatus: "error" as const,
            errorType: "size" as const,
          };
        }

        if (!isValidType) {
          return {
            file,
            previewUrl,
            uploadStatus: "error" as const,
            errorType: "format" as const,
          };
        }

        // 开始上传
        return {
          file,
          previewUrl,
          uploadStatus: "uploading" as const,
          uploadProgress: 0,
        };
      });
      
      // 合并已存在的 items 和新 items，保持文件顺序
      const updatedItems: FileUploadItem[] = [];
      let newIndex = 0;
      
      files.forEach((file) => {
        const existingItem = existingItems.find((item) => item.file === file);
        if (existingItem) {
          updatedItems.push(existingItem);
        } else {
          updatedItems.push(newItems[newIndex]);
          newIndex++;
        }
      });
      
      setReferenceStyleItems(updatedItems);

      // 只为新文件启动真实上传
      newFiles.forEach((file) => {
        const globalIndex = updatedItems.findIndex((item) => item.file === file);
        const item = updatedItems[globalIndex];
        if (item && item.uploadStatus === "uploading") {
          uploadReferencePhotoFile(file, globalIndex, setReferenceStyleItems, updatedItems);
        }
      });
    } else {
      // 清理预览 URL
      referenceStyleItems.forEach((item) => {
        URL.revokeObjectURL(item.previewUrl);
      });
      setReferenceStyleItems([]);
      // 清空参考照片 ID 和 URL
      setReferencePhotoIds([]);
      setReferencePhotoUrls([]);
      // 同步到外部状态
      setReferenceStyles([]);
    }
  };

  // 同步文件删除到 uploadItems
  // 当组件挂载时，如果从外部状态恢复了图片项，同步更新 petPhotoFiles 和 referenceStyleFiles
  // 注意：对于已上传的图片（使用占位符 File），不需要同步到 petPhotoFiles，因为预览使用服务器 URL

  // 清理逻辑：当文件被删除时，清理对应的图片项
  // 注意：只清理未上传的图片（使用 blob URL），保留已上传的图片（使用服务器 URL）
  useEffect(() => {
    if (petPhotoFiles.length === 0) {
      setPetPhotoItems((prevItems) => {
        const uploadedItems = prevItems.filter((item) => {
          // 保留已上传的图片（有 photoId）
          if (item.photoId !== undefined) {
            return true;
          }
          // 清理未上传的图片的 blob URL
          if (item.previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(item.previewUrl);
          }
          return false;
        });
        return uploadedItems;
      });
    }
  }, [petPhotoFiles]);

  useEffect(() => {
    if (referenceStyleFiles.length === 0) {
      setReferenceStyleItems((prevItems) => {
        const uploadedItems = prevItems.filter((item) => {
          // 保留已上传的图片（有 photoId）
          if (item.photoId !== undefined) {
            return true;
          }
          // 清理未上传的图片的 blob URL
          if (item.previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(item.previewUrl);
          }
          return false;
        });
        return uploadedItems;
      });
    }
  }, [referenceStyleFiles]);

  // Clear breed when pet type changes and current breed is not in the new options
  useEffect(() => {
    if (previousPetTypeRef.current !== petType) {
      const breedOptions = getBreedOptions(petType, petBreeds);
      if (breed && !breedOptions.includes(breed)) {
        setBreed("");
      }
      previousPetTypeRef.current = petType;
    }
  }, [petType, breed, petBreeds, setBreed]);

  return (
    <div className="content-stretch flex flex-col gap-[calc(16*var(--px393))] sm:gap-[24px] items-start relative w-full px-[calc(20*var(--px393))] sm:px-0">
      {/* Mobile Step Header */}
      <div className="content-stretch flex flex-col gap-[calc(12*var(--px393))] sm:gap-[12px] items-start relative shrink-0 w-full sm:hidden">
        <p className="font-['Comfortaa:Bold',sans-serif] font-bold h-[calc(19*var(--px393))] sm:h-[19px] leading-[calc(17.5*var(--px393))] sm:leading-[17.5px] relative shrink-0 text-[calc(12*var(--px393))] sm:text-[12px] text-black w-full whitespace-pre-wrap">
          Book your appointment
        </p>
        <div className="border border-[#4c4c4c] border-solid content-stretch flex h-[calc(24*var(--px393))] sm:h-[24px] items-center justify-center overflow-clip px-[calc(9*var(--px393))] py-[calc(5*var(--px393))] sm:px-[9px] sm:py-[5px] relative rounded-[calc(12*var(--px393))] sm:rounded-[12px] shrink-0">
          <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(14*var(--px393))] sm:leading-[14px] relative shrink-0 text-[#4c4c4c] text-[calc(10*var(--px393))] sm:text-[10px]">
            Step 2 of 6
          </p>
        </div>
        <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[calc(28*var(--px393))] sm:leading-[28px] min-w-full relative shrink-0 text-[#4a3c2a] text-[calc(16*var(--px393))] sm:text-[16px] w-[min-content] whitespace-pre-wrap">
          Pet information
        </p>
      </div>
      <div className="flex flex-col gap-[calc(32*var(--px393))] sm:gap-[32px] items-start relative w-full">
        {/* Pet Information Card */}
        <div className="bg-white box-border flex flex-col gap-[calc(16*var(--px393))] sm:gap-[20px] items-start p-[calc(20*var(--px393))] sm:p-[24px] relative rounded-[calc(12*var(--px393))] sm:rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] w-full">
          <div className="flex flex-col gap-[calc(16*var(--px393))] sm:gap-[16px] items-start relative w-full">
            {/* Section Header */}
            <div className="flex flex-col gap-[calc(4*var(--px393))] sm:gap-[4px] items-start relative shrink-0 w-full">
              <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[calc(28*var(--px393))] sm:leading-[28px] relative shrink-0 text-[#4a3c2a] text-[calc(16*var(--px393))] sm:text-[16px]">
                Tell us about your furry friend
              </p>
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(17.5*var(--px393))] sm:leading-[17.5px] relative shrink-0 text-[#4a5565] text-[calc(12.25*var(--px393))] sm:text-[12.25px]">
                This helps groomers prepare and provide the best care possible
              </p>
            </div>

            <div className="flex flex-col gap-[calc(16*var(--px393))] sm:gap-[16px] items-start relative shrink-0 w-full">
              {/* Pet Name */}
              <div className="flex gap-[calc(20*var(--px393))] sm:gap-[20px] items-start relative shrink-0 w-full sm:w-[330px]">
                <div className="flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative shrink-0">
                  <CustomInput
                    label="Pet name"
                    type="text"
                    placeholder="Enter pet name"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                  />
                </div>
              </div>

              {/* Pet Type */}
              <div className="flex flex-col gap-[calc(8*var(--px393))] sm:gap-[8px] items-start relative shrink-0 w-full sm:w-[330px]">
                <div className="flex gap-[7px] h-[calc(12.25*var(--px393))] sm:h-[12.25px] items-center relative shrink-0 w-full">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(22.75*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[calc(14*var(--px393))] sm:text-[14px]">
                    Pet type
                  </p>
                </div>
                <div className="flex flex-nowrap gap-[8px] items-start relative shrink-0 w-full *:flex-none">
                  <CustomRadio
                    label="Dog"
                    icon="dog"
                    isSelected={petType === "dog"}
                    onClick={() => setPetType("dog")}
                  />
                  <CustomRadio
                    label="Cat"
                    icon="cat"
                    isSelected={petType === "cat"}
                    onClick={() => setPetType("cat")}
                  />
                  <CustomRadio
                    label="Other"
                    icon="pet"
                    isSelected={petType === "other"}
                    onClick={() => setPetType("other")}
                  />
                </div>
              </div>

              {/* Breed - Hidden when pet type is cat or other */}
              {petType !== "cat" && petType !== "other" && (
                <div className="flex flex-col gap-[calc(8*var(--px393))] sm:gap-[8px] items-start relative shrink-0 w-full sm:w-[330px]">
                  <div className="flex h-[calc(12.25*var(--px393))] sm:h-[12.25px] items-center justify-between relative shrink-0 w-full">
                    <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(22.75*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[calc(14*var(--px393))] sm:text-[14px]">
                      {isMixedBreed ? "Primary breed" : "Breed"}
                    </p>
                    <div className="flex gap-[calc(4*var(--px393))] sm:gap-[4px] items-center justify-end relative shrink-0">
                      <Switch 
                        className="cursor-pointer"
                        checked={isMixedBreed} 
                        onCheckedChange={setIsMixedBreed}
                      />
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(22.75*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[calc(14*var(--px393))] sm:text-[14px]">
                        Mixed breed
                      </p>
                    </div>
                  </div>
                  <AutoComplete
                    placeholder={isLoadingBreeds ? "Loading breeds..." : "Select or type breed"}
                    value={breed}
                    onValueChange={setBreed}
                    options={getBreedOptions(petType, petBreeds)}
                    disabled={isLoadingBreeds}
                    leftElement={
                      <Icon
                        name="search"
                        className="relative shrink-0 w-[calc(20*var(--px393))] h-[calc(20*var(--px393))] sm:w-[20px] sm:h-[20px] text-[#717182]"
                      />
                    }
                  />
                </div>
              )}

              {/* Precise pet type - Only shown when pet type is other */}
              {petType === "other" && (
                <div className="flex flex-col gap-[calc(8*var(--px393))] sm:gap-[8px] items-start relative shrink-0 w-full">
                  <div className="flex gap-[7px] h-[calc(12.25*var(--px393))] sm:h-[12.25px] items-center relative shrink-0 w-full">
                    <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(22.75*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[calc(14*var(--px393))] sm:text-[14px]">
                      Precise pet type
                    </p>
                  </div>
                  <CustomInput
                    label=""
                    type="text"
                    placeholder="Enter pet type"
                    value={precisePetType}
                    onChange={(e) => setPrecisePetType(e.target.value)}
                  />
                </div>
              )}

              {/* Date of Birth and Gender */}
              <div className="flex flex-col sm:flex-row gap-[calc(16*var(--px393))] sm:gap-[16px] items-start relative shrink-0 w-full">
                <div className="flex flex-col items-start relative shrink-0 w-full sm:w-[140px]">
                  <DatePicker
                    label="Date of birth"
                    placeholder="YYYY-MM"
                    value={dateOfBirth}
                    onChange={setDateOfBirth}
                    mode="month"
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                </div>
                <div className="flex flex-col items-start relative shrink-0 w-full sm:w-[140px]">
                  <CustomSelect
                    className="cursor-pointer"
                    label="Gender"
                    placeholder="Select"
                    value={gender}
                    displayValue={gender ? `${gender[0].toUpperCase()}${gender.slice(1)}` : ""}
                    onValueChange={(value) => setGender(value === "unknown" ? "" : (value as Gender))}
                  >
                    {gender === "" ? (
                      <CustomSelectItem value="unknown">Select</CustomSelectItem>
                    ) : null}
                    <CustomSelectItem value="male">Male</CustomSelectItem>
                    <CustomSelectItem value="female">Female</CustomSelectItem>
                    <CustomSelectItem value="unknown">Unknown</CustomSelectItem>
                  </CustomSelect>
                </div>
              </div>

              {/* Weight */}
              <div className="flex flex-col gap-[calc(8*var(--px393))] sm:gap-[8px] items-start relative shrink-0 w-full">
                <div className="flex gap-[7px] h-[calc(12.25*var(--px393))] sm:h-[12.25px] items-center relative shrink-0 w-full">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(22.75*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[calc(14*var(--px393))] sm:text-[14px]">
                    Weight (lb or kg)
                  </p>
                </div>
                <div className="flex items-start relative shrink-0 w-full sm:w-[200px] group">
                  <div className="bg-white flex-1 h-[calc(36*var(--px393))] sm:h-[36px] relative rounded-bl-[calc(12*var(--px393))] rounded-tl-[calc(12*var(--px393))] sm:rounded-bl-[12px] sm:rounded-tl-[12px] shrink-0">
                    <div className="box-border flex h-[calc(36*var(--px393))] sm:h-[36px] items-center overflow-clip px-[calc(16*var(--px393))] py-[calc(4*var(--px393))] sm:px-[16px] sm:py-[4px] relative rounded-[inherit] w-full">
                      <input
                        type="text"
                        placeholder="Enter weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="flex-1 font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#717182] text-[calc(12.25*var(--px393))] sm:text-[12.25px] bg-transparent border-none outline-none placeholder:text-[#717182]"
                      />
                    </div>
                    {/* Border with states */}
                    <div
                      aria-hidden="true"
                      className="absolute border border-solid inset-0 pointer-events-none rounded-bl-[calc(12*var(--px393))] rounded-tl-[calc(12*var(--px393))] sm:rounded-bl-[12px] sm:rounded-tl-[12px] transition-colors duration-200 border-gray-200 group-hover:border-[#717182] group-focus-within:border-[#2374ff]!"
                    />
                  </div>
                  <div className="relative shrink-0 opacity-80">
                    <CustomSelect
                      placeholder="Select"
                      value={weightUnit}
                      onValueChange={(value) => setWeightUnit(value as WeightUnit)}
                      className="w-auto"
                      noLeftRadius={true}
                    >
                      <CustomSelectItem value="kg">kg</CustomSelectItem>
                      <CustomSelectItem value="lb">lb</CustomSelectItem>
                    </CustomSelect>
                  </div>
                </div>
              </div>

              {/* Coat Condition */}
              <div className="flex flex-col gap-[calc(8*var(--px393))] sm:gap-[8px] items-start relative shrink-0">
                <div className="flex gap-[7px] h-[calc(12.25*var(--px393))] sm:h-[12.25px] items-center relative shrink-0">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(22.75*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[calc(14*var(--px393))] sm:text-[14px]">
                    Coat condition
                  </p>
                </div>
                <div className="flex flex-row flex-wrap gap-[calc(8*var(--px393))] sm:gap-[8px] items-stretch relative shrink-0 w-full">
                  <CustomRadio
                    label="Not matted"
                    isSelected={coatCondition === "not_matted"}
                    onClick={() => handleCoatConditionSelect("not_matted")}
                    className="w-auto flex-none self-stretch h-[calc(53*var(--px393))] sm:h-[53px]"
                  />
                  <CustomRadio
                    label="Matted"
                    isSelected={coatCondition === "matted"}
                    onClick={() => handleCoatConditionSelect("matted")}
                    className="w-auto flex-none self-stretch h-[calc(53*var(--px393))] sm:h-[53px]"
                  />
                  <CustomRadio
                    label="Severely matted"
                    isSelected={coatCondition === "severely_matted"}
                    onClick={() => handleCoatConditionSelect("severely_matted")}
                    className="w-auto flex-none self-stretch h-[calc(53*var(--px393))] sm:h-[53px]"
                  />
                </div>
              </div>

              {/* Behavior */}
              <div className="flex flex-col gap-[calc(8*var(--px393))] sm:gap-[8px] items-start relative shrink-0">
                <div className="flex gap-[7px] h-[calc(12.25*var(--px393))] sm:h-[12.25px] items-center relative shrink-0">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(22.75*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[calc(14*var(--px393))] sm:text-[14px]">
                    Behavior
                  </p>
                </div>
                <div className="flex flex-row flex-wrap gap-[calc(8*var(--px393))] sm:gap-[8px] items-stretch relative shrink-0 w-full">
                  <CustomRadio
                    label="Friendly"
                    isSelected={behavior === "friendly"}
                    onClick={() => handleBehaviorSelect("friendly")}
                    className="w-auto flex-none self-stretch h-[calc(53*var(--px393))] sm:h-[53px]"
                  />
                  <CustomRadio
                    label="Anxious"
                    isSelected={behavior === "anxious"}
                    onClick={() => handleBehaviorSelect("anxious")}
                    className="w-auto flex-none self-stretch h-[calc(53*var(--px393))] sm:h-[53px]"
                  />
                  <CustomRadio
                    label="Hard to handle"
                    isSelected={behavior === "hard_to_handle"}
                    onClick={() => handleBehaviorSelect("hard_to_handle")}
                    className="w-auto flex-none self-stretch h-[calc(53*var(--px393))] sm:h-[53px]"
                  />
                  <CustomRadio
                    label="Senior pets"
                    isSelected={behavior === "senior_pets"}
                    onClick={() => handleBehaviorSelect("senior_pets")}
                    className="w-auto flex-none self-stretch h-[calc(53*var(--px393))] sm:h-[53px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      <AlertDialog
        open={behaviorModal === "hard_to_handle"}
        onOpenChange={(open) => setBehaviorModal(open ? "hard_to_handle" : null)}
      >
        <AlertDialogContent className="bg-white rounded-[calc(20*var(--px393))] sm:rounded-[20px] border border-[rgba(0,0,0,0.2)] p-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] max-w-[90%] sm:max-w-[400px]">
          <div className="flex flex-col gap-[calc(32*var(--px393))] sm:gap-[32px] items-start pb-[calc(32*var(--px393))] pt-[calc(12*var(--px393))] sm:pb-[32px] sm:pt-[12px] w-full">
            <AlertDialogHeader className="px-[calc(12*var(--px393))] sm:px-[12px] w-full">
              <AlertDialogTitle className="font-['Comfortaa:Regular',sans-serif] font-normal text-[calc(14*var(--px393))] sm:text-[14px] text-[#4C4C4C] text-center">
                Hard to handle notice
              </AlertDialogTitle>
              <div className="bg-[rgba(0,0,0,0.1)] h-px w-full mt-[calc(8*var(--px393))] sm:mt-[8px]" />
            </AlertDialogHeader>
            <div className="px-[calc(20*var(--px393))] sm:px-[24px] w-full">
              <AlertDialogDescription asChild>
                <div className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#4C4C4C] leading-[calc(22.75*var(--px393))] sm:leading-[22.75px]">
                  <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[calc(28*var(--px393))] sm:leading-[28px] text-[calc(16*var(--px393))] sm:text-[16px] mb-0 text-black">
                    Hard to Handle
                  </p>
                  <p className="text-[calc(14*var(--px393))] sm:text-[14px] text-[#4C4C4C]">
                    Some pets may become too anxious or aggressive during grooming. If extra care is needed, a handling fee may apply. If a pet shows signs of aggression, it may fall under our Non-Groomable Policy (see cancellation policy).
                  </p>
                </div>
              </AlertDialogDescription>
            </div>
            <AlertDialogFooter className="px-[calc(20*var(--px393))] sm:px-[24px] pt-0 flex flex-row items-center justify-center sm:justify-center w-full">
              <OrangeButton
                variant="primary"
                size="medium"
                onClick={() => setBehaviorModal(null)}
                className="w-[calc(151*var(--px393))] sm:w-[151px]"
              >
                I understand
              </OrangeButton>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={behaviorModal === "senior_pets"}
        onOpenChange={(open) => setBehaviorModal(open ? "senior_pets" : null)}
      >
        <AlertDialogContent className="bg-white rounded-[calc(20*var(--px393))] sm:rounded-[20px] border border-[rgba(0,0,0,0.2)] p-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] max-w-[90%] sm:max-w-[400px]">
          <div className="flex flex-col gap-[calc(32*var(--px393))] sm:gap-[32px] items-start pb-[calc(32*var(--px393))] pt-[calc(12*var(--px393))] sm:pb-[32px] sm:pt-[12px] w-full">
            <AlertDialogHeader className="px-[calc(12*var(--px393))] sm:px-[12px] w-full">
              <AlertDialogTitle className="font-['Comfortaa:Regular',sans-serif] font-normal text-[calc(14*var(--px393))] sm:text-[14px] text-[#4C4C4C] text-center">
                Senior pets notice
              </AlertDialogTitle>
              <div className="bg-[rgba(0,0,0,0.1)] h-px w-full mt-[calc(8*var(--px393))] sm:mt-[8px]" />
            </AlertDialogHeader>
            <div className="px-[calc(20*var(--px393))] sm:px-[24px] w-full">
              <AlertDialogDescription asChild>
                <div className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#4C4C4C] leading-[calc(22.75*var(--px393))] sm:leading-[22.75px]">
                  <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[calc(28*var(--px393))] sm:leading-[28px] text-[calc(16*var(--px393))] sm:text-[16px] mb-0 text-black">
                    Senior pets
                  </p>
                  <p className="text-[calc(14*var(--px393))] sm:text-[14px] text-[#4C4C4C]">
                    Older pets often need more time and gentle handling. A handling fee may be added to ensure their comfort and safety during the service.
                  </p>
                </div>
              </AlertDialogDescription>
            </div>
            <AlertDialogFooter className="px-[calc(20*var(--px393))] sm:px-[24px] pt-0 flex flex-row items-center justify-center sm:justify-center w-full">
              <OrangeButton
                variant="primary"
                size="medium"
                onClick={() => setBehaviorModal(null)}
                className="w-[calc(151*var(--px393))] sm:w-[151px]"
              >
                I understand
              </OrangeButton>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={mattingModalOpen} onOpenChange={setMattingModalOpen}>
        <AlertDialogContent className="flex flex-col bg-white rounded-[calc(20*var(--px393))] sm:rounded-[20px] border border-[rgba(0,0,0,0.2)] p-0 pt-[calc(12*var(--px393))] sm:pt-[12px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] max-w-[90%] sm:max-w-[400px] max-h-[80vh] overflow-hidden sm:max-h-none sm:overflow-visible gap-[calc(32*var(--px393))] sm:gap-[32px]">
          <AlertDialogHeader className="shrink-0 px-[calc(12*var(--px393))] sm:px-[12px] w-full">
            <AlertDialogTitle className="font-['Comfortaa:Regular',sans-serif] font-normal text-[calc(14*var(--px393))] sm:text-[14px] text-[#4C4C4C] text-center">
              Matting removal notice
            </AlertDialogTitle>
            <div className="bg-[rgba(0,0,0,0.1)] h-px w-full mt-[calc(8*var(--px393))] sm:mt-[8px]" />
          </AlertDialogHeader>
          <div className="flex flex-col flex-1 min-h-0 overflow-y-auto gap-[calc(32*var(--px393))] sm:gap-[32px] items-start pb-[calc(32*var(--px393))] sm:pb-[32px] w-full">
            <div className="px-[calc(20*var(--px393))] sm:px-[24px] w-full">
              <AlertDialogDescription asChild>
                <div className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#4C4C4C] leading-[calc(22.75*var(--px393))] sm:leading-[22.75px]">
                  <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[calc(28*var(--px393))] sm:leading-[28px] text-[calc(16*var(--px393))] sm:text-[16px] mb-0 text-black">
                    Matting removal notice
                  </p>
                  <p className="text-[calc(14*var(--px393))] sm:text-[14px] text-[#4C4C4C] mb-0">
                    Mat removal is often painful and time-consuming, an additional fee may apply.
                  </p>
                  <p className="text-[calc(14*var(--px393))] sm:text-[14px] text-[#4C4C4C] mb-0">
                    A shave-down may be the safest option, potentially revealing skin issues like irritations or parasites.
                  </p>
                  <p className="text-[calc(14*var(--px393))] sm:text-[14px] text-[#4C4C4C]">
                    If shaving isn't approved, mats may be left if removal causes too much distress, and the full charge will still apply.
                  </p>
                </div>
              </AlertDialogDescription>
            </div>
            <div className="px-[calc(20*var(--px393))] sm:px-[24px] w-full">
              <div className="font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[calc(16*var(--px393))] sm:text-[16px] text-[#4a3c2a] leading-[calc(28*var(--px393))] sm:leading-[28px] mb-[calc(14*var(--px393))] sm:mb-[14px]">
                Select one option
              </div>
              <div className="flex flex-col gap-[calc(14*var(--px393))] sm:gap-[14px]">
                <button
                  type="button"
                  onClick={() => setApproveShaveSelection(true)}
                  className={`border-2 rounded-[calc(14*var(--px393))] p-[calc(16*var(--px393))] sm:rounded-[14px] sm:p-[16px] w-full text-left transition-colors cursor-pointer ${
                    approveShaveSelection === true
                      ? "border-[#de6a07] bg-[#fff3e9]"
                      : "border-[#e5e7eb] bg-white"
                  }`}
                >
                  <div className="flex gap-[calc(8*var(--px393))] sm:gap-[8px] items-start">
                    <div className="relative shrink-0 size-[16px] mt-[2.5px]">
                      <div className="size-[16px] rounded-full border border-solid border-[#717182] bg-white">
                        {approveShaveSelection === true ? (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[8px] rounded-full bg-[#de6a07]" />
                        ) : null}
                      </div>
                    </div>
                    <div className="text-[calc(14*var(--px393))] sm:text-[14px] leading-[calc(21*var(--px393))] sm:leading-[21px] text-[#8b6357]">
                      <span className="font-['Comfortaa:Bold',sans-serif] font-bold">
                        I approve{" "}
                      </span>
                      <span className="font-['Comfortaa:Regular',sans-serif] font-normal">
                        the groomer to shave my pet if needed.
                      </span>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setApproveShaveSelection(false)}
                  className={`border-2 rounded-[calc(14*var(--px393))] p-[calc(16*var(--px393))] sm:rounded-[14px] sm:p-[16px] w-full text-left transition-colors cursor-pointer ${
                    approveShaveSelection === false
                      ? "border-[#de6a07] bg-[#fff3e9]"
                      : "border-[#e5e7eb] bg-white"
                  }`}
                >
                  <div className="flex gap-[calc(8*var(--px393))] sm:gap-[8px] items-start">
                    <div className="relative shrink-0 size-[16px] mt-[2.5px]">
                      <div className="size-[16px] rounded-full border border-solid border-[#717182] bg-white">
                        {approveShaveSelection === false ? (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[8px] rounded-full bg-[#de6a07]" />
                        ) : null}
                      </div>
                    </div>
                    <div className="text-[calc(14*var(--px393))] sm:text-[14px] leading-[calc(21*var(--px393))] sm:leading-[21px] text-[#8b6357]">
                      <span className="font-['Comfortaa:Bold',sans-serif] font-bold">
                        I do not approve{" "}
                      </span>
                      <span className="font-['Comfortaa:Regular',sans-serif] font-normal">
                        a shave-down and understand that the full charge will apply even if mats remain.
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <AlertDialogFooter className="px-[calc(20*var(--px393))] sm:px-[24px] pt-0 flex flex-row items-center justify-center sm:justify-center w-full">
              <OrangeButton
                variant="primary"
                size="medium"
                onClick={handleMattingSubmit}
                disabled={approveShaveSelection === null}
                className="w-[calc(120*var(--px393))] sm:w-[120px]"
              >
                Submit
              </OrangeButton>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

        {/* Grooming Frequency Card */}
        <div className="bg-white box-border flex flex-col gap-[calc(20*var(--px393))] sm:gap-[20px] items-start p-[calc(20*var(--px393))] sm:p-[24px] relative rounded-[calc(12*var(--px393))] sm:rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] w-full">
        <div className="flex flex-col gap-[calc(14*var(--px393))] sm:gap-[14px] items-start relative shrink-0 w-full">
          <div className="flex flex-col gap-[calc(3.5*var(--px393))] sm:gap-[3.5px] items-start relative shrink-0">
            <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[calc(28*var(--px393))] sm:leading-[28px] relative shrink-0 text-[#4a3c2a] text-[calc(16*var(--px393))] sm:text-[16px]">
              How often would you like grooming?
            </p>
            {/* Info Alert */}
            <div className="bg-blue-50 border border-[#bedbff] border-solid relative rounded-[calc(8*var(--px393))] sm:rounded-[8px] shrink-0 w-full">
              <div className="box-border flex items-center overflow-clip px-[calc(16*var(--px393))] py-[calc(8*var(--px393))] sm:px-[16px] sm:py-[8px] relative rounded-[inherit]">
                <div className="flex gap-[calc(8*var(--px393))] sm:gap-[8px] items-start relative shrink-0 w-full min-w-0">
                  <Icon
                    name="alert-info"
                    className="relative shrink-0 size-[12px] text-[#2374FF]"
                  />
                  <div className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(14*var(--px393))] sm:leading-[14px] relative text-[#193cb8] text-[calc(10*var(--px393))] sm:text-[10px] whitespace-normal break-words min-w-0">
                    <p className="font-['Comfortaa:Bold',sans-serif] font-bold mb-0">
                      Professional Tip:
                    </p>
                    <p>
                      Regular grooming every 2-4 weeks keeps your pet's coat healthy, reduces shedding, and helps detect health issues early.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row flex-wrap gap-[calc(8*var(--px393))] sm:gap-[16px] relative sm:h-[166px] *:flex-[1_1_calc(50%-4px)] *:min-w-0 *:sm:flex-[1_1_calc(50%-8px)]">
            <CustomRadio
              label="Weekly"
              description="Once a week"
              isSelected={groomingFrequency === "weekly"}
              onClick={() => setGroomingFrequency("weekly")}
              variant="with-description"
            />
            <CustomRadio
              label="Bi-weekly"
              description="Every 2 weeks"
              isSelected={groomingFrequency === "bi_weekly"}
              onClick={() => setGroomingFrequency("bi_weekly")}
              variant="with-description"
            />
            <CustomRadio
              label="Monthly"
              description="Once a month"
              isSelected={groomingFrequency === "monthly"}
              onClick={() => setGroomingFrequency("monthly")}
              variant="with-description"
            />
            <CustomRadio
              label="Occasionally"
              description="As needed"
              isSelected={groomingFrequency === "occasionally"}
              onClick={() => setGroomingFrequency("occasionally")}
              variant="with-description"
            />
          </div>
        </div>
        </div>

        {/* Upload Pet Photo Card */}
        <div className="bg-white box-border flex flex-col gap-[calc(20*var(--px393))] sm:gap-[20px] items-start p-[calc(20*var(--px393))] sm:p-[24px] relative rounded-[calc(12*var(--px393))] sm:rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] w-full">
          <div className="flex flex-col gap-[calc(14*var(--px393))] sm:gap-[14px] items-start relative shrink-0 w-full">
            <div className="flex flex-col gap-[calc(8*var(--px393))] sm:gap-[8px] items-start relative shrink-0 w-full">
              <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[calc(28*var(--px393))] sm:leading-[28px] relative shrink-0 text-[calc(16*var(--px393))] sm:text-[16px] text-black whitespace-pre-wrap">
                Upload pet photo (optional but helpful)
              </p>
              <div className="flex flex-col gap-[calc(12*var(--px393))] sm:gap-[12px] items-start overflow-clip relative shrink-0 w-full">
                <FileUpload
                  accept="image/*"
                  multiple={true}
                  maxSizeMB={10}
                  onChange={handlePetPhotoChange}
                  onRemove={(index) => {
                    // 删除已上传的图片
                    // 使用函数式更新，确保基于最新状态
                    setPetPhotoItems((prevItems) => {
                      const item = prevItems[index];
                      if (item && item.uploadStatus === "uploaded" && item.photoId !== undefined) {
                        // 从当前状态中移除对应的 photoId 和 photoUrl
                        const currentPhotoIds = photoIdsRef.current;
                        const currentPhotoUrls = photoUrlsRef.current;
                        const photoIndex = currentPhotoIds.indexOf(item.photoId);
                        
                        setPhotoIds(currentPhotoIds.filter((id) => id !== item.photoId));
                        if (photoIndex >= 0 && photoIndex < currentPhotoUrls.length) {
                          setPhotoUrls(currentPhotoUrls.filter((_, idx) => idx !== photoIndex));
                        }
                        
                        // 从 petPhotoItems 中移除（使用函数式更新，避免闭包问题）
                        return prevItems.filter((_, i) => i !== index);
                      }
                      return prevItems;
                    });
                  }}
                  uploadItems={petPhotoItems}
                  buttonText="Click to upload"
                  fileTypeHint="JPG, JPEG, PNG less than 10MB"
                  showDragHint={true}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Upload Reference Styles Card */}
        <ReferenceStylesUpload 
          onChange={handleReferenceStylesChange}
          uploadItems={referenceStyleItems}
        />

        {/* Special Notes Card */}
        <div className="bg-white box-border flex flex-col gap-[calc(20*var(--px393))] sm:gap-[20px] items-start p-[calc(20*var(--px393))] sm:p-[24px] relative rounded-[calc(12*var(--px393))] sm:rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] w-full">
          <div className="flex flex-col gap-[calc(12*var(--px393))] sm:gap-[12px] items-start relative shrink-0 w-full">
            <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[calc(28*var(--px393))] sm:leading-[28px] text-[calc(16*var(--px393))] sm:text-[16px] text-[#4a3c2a] w-full whitespace-pre-wrap">
              Special instruments or notes{"\n"}(optional)
            </p>
              <CustomTextarea
                label=""
                placeholder="e.g., 'My dog is nervous around clippers', 'Has sensitive skin', 'I have 2 pets and prefer to groom together..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                helperText="Include any health conditions, behavioral notes, or grooming preferences"
                aria-label="Special instruments or notes (optional)"
                labelClassName="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[calc(28*var(--px393))] sm:leading-[28px] text-[calc(16*var(--px393))] sm:text-[16px]"
              />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-[calc(12*var(--px393))] sm:flex-row sm:gap-[20px] items-start relative shrink-0 w-full">
          <div className="flex flex-col gap-[calc(12*var(--px393))] sm:flex-row sm:gap-[20px] items-center relative shrink-0 w-full sm:w-auto">
            <OrangeButton
              size="medium"
              onClick={handlePrimaryAction}
              loading={isPrimaryActionLoading}
              className="w-full sm:w-auto"
            >
              <div className="flex gap-[calc(4*var(--px393))] sm:gap-[4px] items-center">
                <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[calc(17.5*var(--px393))] sm:leading-[17.5px] text-[calc(14*var(--px393))] sm:text-[14px] text-white">
                  {primaryLabel}
                </p>
                <Icon
                  name="button-arrow"
                  aria-label="Arrow"
                  className="size-[14px] text-white"
                />
              </div>
            </OrangeButton>
            {showBackButton ? (
              <button
                type="button"
                onClick={handleBackAction}
                className="border-2 border-[#de6a07] border-solid box-border flex gap-[calc(8*var(--px393))] sm:gap-[8px] h-[calc(36*var(--px393))] sm:h-[36px] items-center justify-center px-[calc(30*var(--px393))] sm:px-[30px] relative rounded-[calc(32*var(--px393))] sm:rounded-[32px] shrink-0 cursor-pointer hover:bg-[rgba(222,106,7,0.1)] transition-colors w-full sm:w-auto"
              >
                <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[calc(17.5*var(--px393))] sm:leading-[17.5px] relative shrink-0 text-[calc(14*var(--px393))] sm:text-[14px] text-[#de6a07]">
                  {backLabel}
                </p>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
