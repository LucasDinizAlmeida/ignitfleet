import * as TaskManager from 'expo-task-manager'
import { Accuracy, startLocationUpdatesAsync, stopLocationUpdatesAsync, hasStartedLocationUpdatesAsync } from 'expo-location'
import { removeStorageLocation, saveStorageLocation } from '../libs/asyncStorage/locationStorage'

export const BACKGROUND_TASK_NAME = 'location-tracking'

TaskManager.defineTask(BACKGROUND_TASK_NAME, async ({ data, error }: any) => {

    try {
        if(error) {
            throw error
        }

        if(data) {
            const { coords, timestamp } = data.locations[0]
    
            const currentLocation = {
                latitude: coords.latitude,
                longitude: coords.longitude,
                timestamp: timestamp
            }

            await saveStorageLocation(currentLocation)
        }


    } catch (error) {
        console.log(error)
        await stopLocationTask()
    }

})

export async function startLocationTask() {
    try {
        const hashStarted = await hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME)

        if(hashStarted) {
            await stopLocationTask()
        }

        await startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
            accuracy: Accuracy.High,
            distanceInterval: 1,
            timeInterval: 1000
        })
        
    } catch (error) {
        console.log(error)
    }
}

export async function stopLocationTask() {
    try {
        const hashStarted = await hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME)

        if(hashStarted) {
            await stopLocationUpdatesAsync(BACKGROUND_TASK_NAME)
            await removeStorageLocation()
        }
        
    } catch (error) {
        console.log(error)
    }
}