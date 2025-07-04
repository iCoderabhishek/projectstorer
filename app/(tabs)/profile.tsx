import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAuth, useUser, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { ProjectCard } from '@/components/ProjectCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { apiService } from '@/services/api';
import { Project } from '@/types/project';
import { Plus, User as UserIcon, LogOut, Folder } from 'lucide-react-native';

export default function ProfileTab() {
  const { user } = useUser();
  const { getToken, signOut } = useAuth();
  const router = useRouter();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserProjects = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const data = await apiService.getUserProjects(token);
      setProjects(data);
    } catch (err) {
      setError('Failed to load your projects. Please try again.');
      console.error('Error loading user projects:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadUserProjects();
  }, [loadUserProjects]);

  const onRefresh = useCallback(() => {
    loadUserProjects(true);
  }, [loadUserProjects]);

  const handleCreateProject = () => {
    router.push('/create-project');
  };

  const handleEditProject = (project: Project) => {
    router.push({
      pathname: '/edit-project',
      params: { projectId: project.id }
    });
  };

  const handleDeleteProject = async (project: Project) => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await getToken();
              if (!token) return;

              await apiService.deleteProject(token, project.id);
              setProjects(prev => prev.filter(p => p.id !== project.id));
            } catch (err) {
              Alert.alert('Error', 'Failed to delete project. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => signOut(),
        },
      ]
    );
  };

  const renderProject = ({ item }: { item: Project }) => (
    <ProjectCard
      project={item}
      showActions
      onEdit={() => handleEditProject(item)}
      onDelete={() => handleDeleteProject(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <SignedIn>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <UserIcon size={24} color="#007AFF" />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {user?.firstName || 'User'}
                </Text>
                <Text style={styles.userEmail}>
                  {user?.emailAddresses[0]?.emailAddress}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
              <LogOut size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{projects.length}</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.createButton} onPress={handleCreateProject}>
            <Plus size={20} color="#fff" />
            <Text style={styles.createButtonText}>Create Project</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <EmptyState
            icon={<Folder size={64} color="#ccc" />}
            title="Something went wrong"
            description={error}
          />
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<Folder size={64} color="#ccc" />}
            title="No projects yet"
            description="Create your first project to get started!"
          />
        ) : (
          <FlatList
            data={projects}
            renderItem={renderProject}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#007AFF"
                colors={['#007AFF']}
              />
            }
          />
        )}
      </SignedIn>

      <SignedOut>
        <View style={styles.signedOutContainer}>
          <EmptyState
            icon={<UserIcon size={64} color="#ccc" />}
            title="Welcome to ProjectShare"
            description="Sign in to create and manage your projects"
          />
          
          <View style={styles.authButtons}>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity style={styles.signInButton}>
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity style={styles.signUpButton}>
                <Text style={styles.signUpButtonText}>Create Account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </SignedOut>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
    fontFamily: 'Inter-Bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  signOutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
    marginRight: 32,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  listContent: {
    paddingVertical: 8,
  },
  signedOutContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  authButtons: {
    gap: 12,
    marginTop: 32,
  },
  signInButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  signUpButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    fontFamily: 'Inter-SemiBold',
  },
});