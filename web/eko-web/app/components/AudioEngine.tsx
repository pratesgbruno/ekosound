"use client";
import { useEffect } from 'react';
import { useAudioStore } from '../../store/useAudioStore';

export default function AudioEngine() {
    // The AudioController singleton handles the actual <audio> element.
    // This component helps ensure the store and controller are synced on mount
    // or handles side effects if necessary.

    return null;
}
