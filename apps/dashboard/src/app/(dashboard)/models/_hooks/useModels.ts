import { useState, useEffect } from "react"
import { V1beta1Model, V1beta1ModelServingRuntime } from "@package/api"

interface UseModelsProps {
  search?: string
}

export const demoModels: V1beta1Model[] = [
  {
    id: "model-bert-base",
    name: "BERT Base Uncased",
    description: "Pre-trained BERT model for natural language processing tasks",
    versions: [
      { version: "1.0.0", id: "v1" },
      { version: "1.1.0", id: "v2" },
    ],
    deploymentIds: ["deployment-bert-prod"],
    deploymentConfig: {
      runtime: V1beta1ModelServingRuntime.HuggingfaceModelserver,
    },
    tags: [
      { key: "Type", value: "NLP" },
      { key: "Framework", value: "Transformers" },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    tenantId: "acme-corp",
    metadata: [],
    internal: false,
  },
  {
    id: "model-resnet50",
    name: "ResNet-50",
    description: "Deep residual network for computer vision",
    versions: [{ version: "1.0.0", id: "v1" }],
    deploymentIds: ["deployment-resnet-prod", "deployment-resnet-staging"],
    deploymentConfig: {
      runtime: V1beta1ModelServingRuntime.Tfserving,
    },
    tags: [
      { key: "Type", value: "Vision" },
      { key: "Framework", value: "PyTorch" },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    tenantId: "acme-corp",
    metadata: [],
    internal: false,
  },
]

export function useModels({ search }: UseModelsProps = {}) {
  const [models, setModels] = useState<V1beta1Model[]>([])

  useEffect(() => {
    const storedModels = JSON.parse(localStorage.getItem("models") || "[]")
    const initialModels = storedModels.length === 0 ? demoModels : storedModels

    const filteredModels = search
      ? initialModels.filter(
          (model: V1beta1Model) =>
            model.name?.toLowerCase().includes(search.toLowerCase()) ||
            model.description?.toLowerCase().includes(search.toLowerCase())
        )
      : initialModels

    setModels(filteredModels)
  }, [search])

  return { models }
}
