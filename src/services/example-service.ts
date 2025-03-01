/**
 * Example Service
 * 
 * Demonstrates how to implement a specific service by extending the BaseService.
 * This example service interacts with a fictional API and shows proper error handling,
 * rate limiting, and data transformation patterns.
 */

import { BaseService } from './base-service.js';
import config from '../config.js';
import { ExampleResource, CreateResourceData, UpdateResourceData } from '../types/example-types.js';

/**
 * Service for interacting with the Example API
 */
export class ExampleService extends BaseService {
    private static instance: ExampleService;

    /**
     * Private constructor to enforce singleton pattern
     * @param apiKey - API key for authentication
     */
    private constructor(apiKey: string) {
        super(
            config.serviceUrl,
            {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        );
    }

    /**
     * Initializes the ExampleService singleton instance
     * @param apiKey - API key for authentication
     * @returns The singleton instance of ExampleService
     */
    public static initialize(apiKey: string): ExampleService {
        if (!ExampleService.instance) {
            ExampleService.instance = new ExampleService(apiKey);
        }
        return ExampleService.instance;
    }

    /**
     * Gets the singleton instance of ExampleService
     * @returns The singleton instance of ExampleService
     * @throws Error if service hasn't been initialized
     */
    public static getInstance(): ExampleService {
        if (!ExampleService.instance) {
            throw new Error('ExampleService not initialized. Call initialize() first.');
        }
        return ExampleService.instance;
    }

    /**
     * Retrieves a list of resources
     * @param filters - Optional filters to apply
     * @returns Promise resolving to an array of resources
     */
    async getResources(filters?: {
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<ExampleResource[]> {
        return this.makeRequest(async () => {
            const params = new URLSearchParams();

            if (filters) {
                if (filters.status) params.append('status', filters.status);
                if (filters.limit) params.append('limit', filters.limit.toString());
                if (filters.offset) params.append('offset', filters.offset.toString());
            }

            const queryString = params.toString();
            const url = `/resources${queryString ? `?${queryString}` : ''}`;

            const response = await this.client.get(url);
            return response.data.resources;
        });
    }

    /**
     * Retrieves a specific resource by ID
     * @param resourceId - ID of the resource to retrieve
     * @returns Promise resolving to the resource
     */
    async getResource(resourceId: string): Promise<ExampleResource> {
        return this.makeRequest(async () => {
            const response = await this.client.get(`/resources/${resourceId}`);
            return response.data;
        });
    }

    /**
     * Creates a new resource
     * @param data - Resource creation data
     * @returns Promise resolving to the created resource
     */
    async createResource(data: CreateResourceData): Promise<ExampleResource> {
        return this.makeRequest(async () => {
            const response = await this.client.post('/resources', data);
            return response.data;
        });
    }

    /**
     * Updates an existing resource
     * @param resourceId - ID of the resource to update
     * @param data - Resource update data
     * @returns Promise resolving to the updated resource
     */
    async updateResource(resourceId: string, data: UpdateResourceData): Promise<ExampleResource> {
        return this.makeRequest(async () => {
            const response = await this.client.put(`/resources/${resourceId}`, data);
            return response.data;
        });
    }

    /**
     * Deletes a resource
     * @param resourceId - ID of the resource to delete
     * @returns Promise resolving when deletion is complete
     */
    async deleteResource(resourceId: string): Promise<void> {
        return this.makeRequest(async () => {
            await this.client.delete(`/resources/${resourceId}`);
        });
    }

    /**
     * Searches for resources by name
     * @param name - Name to search for
     * @returns Promise resolving to matching resources
     */
    async searchResourcesByName(name: string): Promise<ExampleResource[]> {
        return this.makeRequest(async () => {
            const response = await this.client.get(`/resources/search?name=${encodeURIComponent(name)}`);
            return response.data.resources;
        });
    }

    /**
     * Finds a resource by exact name match
     * @param name - Name to find
     * @returns Promise resolving to the resource or null if not found
     */
    async findResourceByName(name: string): Promise<ExampleResource | null> {
        const resources = await this.searchResourcesByName(name);
        return resources.find(resource => resource.name.toLowerCase() === name.toLowerCase()) || null;
    }
}
