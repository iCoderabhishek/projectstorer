import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Dimensions,
} from 'react-native';
import { ExternalLink, Github, Calendar, User, Code } from 'lucide-react-native';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const { width } = Dimensions.get('window');
const cardWidth = width - 32;

export function ProjectCard({ project, onEdit, onDelete, showActions = false }: ProjectCardProps) {
  const handleGithubPress = () => {
    if (project.githubUrl) {
      Linking.openURL(project.githubUrl);
    }
  };

  const handleLivePress = () => {
    if (project.liveUrl) {
      Linking.openURL(project.liveUrl);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      {project.imageUrl && (
        <Image source={{ uri: project.imageUrl }} style={styles.image} />
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{project.title}</Text>
        
        {project.description && (
          <Text style={styles.description} numberOfLines={3}>
            {project.description}
          </Text>
        )}

        <View style={styles.metadata}>
          <View style={styles.metadataRow}>
            <User size={14} color="#666" />
            <Text style={styles.metadataText}>{project.user.email}</Text>
          </View>
          
          <View style={styles.metadataRow}>
            <Calendar size={14} color="#666" />
            <Text style={styles.metadataText}>{formatDate(project.createdAt)}</Text>
          </View>
          
          {project.techStack && (
            <View style={styles.metadataRow}>
              <Code size={14} color="#666" />
              <Text style={styles.metadataText}>{project.techStack}</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <View style={styles.linkButtons}>
            {project.githubUrl && (
              <TouchableOpacity style={styles.linkButton} onPress={handleGithubPress}>
                <Github size={16} color="#007AFF" />
                <Text style={styles.linkButtonText}>GitHub</Text>
              </TouchableOpacity>
            )}
            
            {project.liveUrl && (
              <TouchableOpacity style={styles.linkButton} onPress={handleLivePress}>
                <ExternalLink size={16} color="#007AFF" />
                <Text style={styles.linkButtonText}>Live Demo</Text>
              </TouchableOpacity>
            )}
          </View>

          {showActions && (
            <View style={styles.editActions}>
              {onEdit && (
                <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
              
              {onDelete && (
                <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
  metadata: {
    marginBottom: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metadataText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    fontFamily: 'Inter-Regular',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    gap: 6,
  },
  linkButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});