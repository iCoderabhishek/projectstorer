import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { ProjectForm } from '@/components/ProjectForm';
import { apiService } from '@/services/api';
import { CreateProjectData } from '@/types/project';

export default function CreateProjectScreen() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateProjectData) => {
    try {
      setIsLoading(true);
      const token = await getToken();
      
      if (!token) {
        throw new Error('No authentication token');
      }

      // Add a default image if none provided
      const projectData = {
        ...data,
        imageUrl: data.imageUrl || 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
      };

      await apiService.createProject(token, projectData);
      router.back();
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProjectForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
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