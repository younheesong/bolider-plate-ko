import Axios from 'axios';
import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import {auth} from '../_actions/user_action';

export default function(SpecificComponent, option, adminRoute=null){
    //option -null : 아무나 출입가능
    // true : 로그인한 유저만 출입 가능
    //false : 로그인한 유저는 출입 불가
    
    //만약 admin user만 출입가능하면 세번째 인자가 true

    function AuthenticationCheck(props){
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response=>{
                console.log(response)

                //로그인하지 않은 상태
                if (!response.payload.isAuth){
                    if(option){
                        props.history.push('./login')
                    }
                }else{
                    // 로그인한 상태
                    if (adminRoute && !response.payload.isAdmin){
                        props.history.push('/')
                    }else{
                        //option이 false일때
                        if(option===false)
                        props.history.push('/')
                    }
                }
            })
        }, [])
        return (
            <SpecificComponent/>
        )
    }

    return AuthenticationCheck
}