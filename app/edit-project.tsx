import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ProjectForm } from '@/components/ProjectForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { apiService } from '@/services/api';
import { CreateProjectData, Project } from '@/types/project';

export default function EditProjectScreen() {
  const { getToken } = useAuth();
  const router = useRouter();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      if (!projectId) return;
      
      const data = await apiService.getProjectById(projectId);
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateProjectData) => {
    try {
      setIsSubmitting(true);
      const token = await getToken();
      
      if (!token || !projectId) {
        throw new Error('Missing authentication or project ID');
      }

      await apiService.updateProject(token, projectId, data);
      router.back();
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProjectForm
        project={project}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSubmitting}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});