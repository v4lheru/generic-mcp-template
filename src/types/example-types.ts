/**
 * Example Types
 * 
 * Type definitions for the example service.
 * These types represent the data structures used by the API.
 */

/**
 * Status options for resources
 */
export type ResourceStatus = 'active' | 'inactive' | 'pending' | 'archived';

/**
 * Priority levels for resources
 */
export type ResourcePriority = 1 | 2 | 3 | 4 | null;

/**
 * Represents a resource from the API
 */
export interface ExampleResource {
    /** Unique identifier */
    id: string;
    /** Display name */
    name: string;
    /** Detailed description */
    description?: string;
    /** Current status */
    status: ResourceStatus;
    /** Creation timestamp */
    createdAt: string;
    /** Last update timestamp */
    updatedAt: string;
    /** Priority level (1-4, where 1 is highest) */
    priority?: ResourcePriority;
    /** Associated tags */
    tags: string[];
    /** Custom metadata */
    metadata?: Record<string, any>;
}

/**
 * Data required to create a new resource
 */
export interface CreateResourceData {
    /** Display name (required) */
    name: string;
    /** Detailed description (optional) */
    description?: string;
    /** Initial status (defaults to 'pending' if not specified) */
    status?: ResourceStatus;
    /** Priority level (optional) */
    priority?: ResourcePriority;
    /** Associated tags (optional) */
    tags?: string[];
    /** Custom metadata (optional) */
    metadata?: Record<string, any>;
}

/**
 * Data for updating an existing resource
 * All fields are optional since updates can be partial
 */
export interface UpdateResourceData {
    /** Updated display name */
    name?: string;
    /** Updated description */
    description?: string;
    /** Updated status */
    status?: ResourceStatus;
    /** Updated priority */
    priority?: ResourcePriority;
    /** Updated tags (replaces existing tags) */
    tags?: string[];
    /** Updated metadata (merged with existing metadata) */
    metadata?: Record<string, any>;
}

/**
 * Filter options for listing resources
 */
export interface ResourceFilters {
    /** Filter by status */
    status?: ResourceStatus;
    /** Filter by priority */
    priority?: ResourcePriority;
    /** Filter by tag (resources must have at least one matching tag) */
    tags?: string[];
    /** Filter by creation date (resources created after this date) */
    createdAfter?: string;
    /** Filter by creation date (resources created before this date) */
    createdBefore?: string;
    /** Maximum number of resources to return */
    limit?: number;
    /** Number of resources to skip (for pagination) */
    offset?: number;
}
