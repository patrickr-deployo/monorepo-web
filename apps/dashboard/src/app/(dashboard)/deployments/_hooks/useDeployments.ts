import { useState, useEffect } from "react"
import {
  ComponentExtensionSpecScaleMetric,
  V1beta1Inference,
  V1beta1InferenceServiceStatusStatus,
} from "@package/api"

interface UseDeploymentsProps {
  search?: string
}

export const demoDeployments: V1beta1Inference[] = [
  {
    id: "deployment-bert-prod",
    tenantId: "acme-corp",
    instanceType: "t2.xlarge",
    version: "1.0.0",
    spec: {
      predictor: {
        modelId: "model-bert-base",
        modelName: "BERT Base Uncased",
        modelVersion: "1.0.0",
        componentExtension: {
          minReplicas: 1,
          maxReplicas: 3,
          scaleTarget: 80,
          scaleMetric: ComponentExtensionSpecScaleMetric.Cpu,
          containerConcurrency: "1",
          timeout: "30",
          canaryWeight: 0.5,
        },
      },
    },
    status: {
      status: V1beta1InferenceServiceStatusStatus.AllComponentsReady,
      url: "https://api.deployo.ai/v1/models/model-bert-base/predict",
      address: "bert-base-predictor.default.svc.cluster.local",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "deployment-resnet-prod",
    tenantId: "acme-corp",
    instanceType: "g4dn.xlarge",
    version: "1.0.0",
    spec: {
      predictor: {
        modelId: "model-resnet50",
        modelName: "ResNet-50",
        modelVersion: "1.0.0",
        componentExtension: {
          minReplicas: 2,
          maxReplicas: 5,
          scaleTarget: 70,
          scaleMetric: ComponentExtensionSpecScaleMetric.Concurrency,
          containerConcurrency: "2",
          timeout: "60",
        },
      },
    },
    status: {
      status: V1beta1InferenceServiceStatusStatus.AllComponentsReady,
      url: "https://api.deployo.ai/v1/models/resnet50/predict",
      address: "resnet50-predictor.default.svc.cluster.local",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
]

export function useDeployments({ search }: UseDeploymentsProps = {}) {
  const [deployments, setDeployments] = useState<V1beta1Inference[]>([])

  useEffect(() => {
    const storedDeployments = JSON.parse(
      localStorage.getItem("deployments") || "[]"
    )

    // If there are no stored deployments, use demo deployments
    // If there are stored deployments, keep them and don't add demos
    const initialDeployments =
      storedDeployments.length === 0 ? demoDeployments : storedDeployments

    const filteredDeployments = search
      ? initialDeployments.filter((deployment: V1beta1Inference) =>
          deployment.id?.toLowerCase().includes(search.toLowerCase())
        )
      : initialDeployments

    setDeployments(filteredDeployments)
  }, [search])

  return { deployments }
}
