import React, {useEffect, useRef} from 'react';
import {useSetRecoilState} from 'recoil';
import {globaAppState} from './RecoilState';
import {AppState} from 'react-native';

export const AppStateComponent = () => {
  const appState = useRef(AppState.currentState);
  const setAppState = useSetRecoilState(globaAppState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('AppState: previousState', appState.current);
      setAppState(prev => ({
        ...prev,
        state: nextAppState,
        active: nextAppState === 'active',
        previousState: appState.current,
        changeToActive:
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active',
      }));
      appState.current = nextAppState;
      console.log('AppState: current', appState.current);
    });

    return () => {
      subscription && subscription.remove();
    };
  }, []);

  return <></>;
};
