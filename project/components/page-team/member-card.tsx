"use client";
import React, { useEffect, useState } from 'react';
import { Mail, Calendar, Edit2, UserX  } from 'lucide-react';
import {  getUserImage } from '@/lib/hooks/projectMembers';
import { useUser } from '@clerk/nextjs';
import LoadingPage from '../pages/loading';
import ErrorPage from '../pages/error';
import LoadingCard  from '../pages/loading-card';

export function MemberCard(
  {clerkId, name, position, email, join, approved} : 
  {clerkId: string; name: string; position: string; email: string; join: string; approved: boolean}){

const { data: imageUrl, isLoading: imageUrlLoading, error: imageUrlError } = getUserImage(clerkId);


const isLoading = imageUrlLoading;
const hasError = imageUrlError;

return (
  <div className="p-6 transition-all duration-200 bg-white border border-gray-200 dark:bg-gray-800 rounded-xl dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg group">
    {isLoading ? (
  <LoadingCard/>
) : hasError ? (
  <ErrorPage code={123} message="hello" />
) : (
      <>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {imageUrl ? (
              <img
                src={imageUrl}
                className="flex items-center justify-center w-12 h-12 text-lg font-semibold text-white rounded-full"
              />
            ) : (
              <div className="flex items-center justify-center w-12 h-12 text-lg font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{position}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Mail className="w-4 h-4" />
            <span>{email}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>Joined {join}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex space-x-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="Edit member">
                <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>

              <button className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30" title="Kick member">
                <UserX className="w-4 h-4 text-red-500 dark:text-red-400" />
              </button>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {approved ? 'Approved' : 'Pending'}
            </span>
          </div>
        </div>
      </>
    )}
  </div>
);
  }
