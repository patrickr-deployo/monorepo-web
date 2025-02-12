import { V1beta1ModelServingRuntime } from "@package/api"

// map model runtime to a human readable name
export const modelRuntimeToName = {
  [V1beta1ModelServingRuntime.LightgbmMlserver]: "LightGBM",
  [V1beta1ModelServingRuntime.LightgbmModelserver]: "LightGBM",
  [V1beta1ModelServingRuntime.MlflowModelserver]: "MLFlow",
  [V1beta1ModelServingRuntime.PmmlModelserver]: "PMML",
  [V1beta1ModelServingRuntime.SklearnMlserver]: "Scikit-Learn",
  [V1beta1ModelServingRuntime.SklearnModelserver]: "Scikit-Learn",
  [V1beta1ModelServingRuntime.Tfserving]: "TensorFlow",
  [V1beta1ModelServingRuntime.Torchserver]: "PyTorch",
  [V1beta1ModelServingRuntime.TritonInferenceServer]: "Triton",
  [V1beta1ModelServingRuntime.XgboostMlserver]: "XGBoost",
  [V1beta1ModelServingRuntime.XgboostModelserver]: "XGBoost",
  [V1beta1ModelServingRuntime.HuggingfaceModelserver]: "Huggingface",
  [V1beta1ModelServingRuntime.HuggingfaceVllmModelServer]: "Huggingface",
  [V1beta1ModelServingRuntime.Custom]: "Custom",
  [V1beta1ModelServingRuntime.Unspecified]: "N/A",
} as const

export type ModelRuntime =
  (typeof modelRuntimeToName)[keyof typeof modelRuntimeToName]
