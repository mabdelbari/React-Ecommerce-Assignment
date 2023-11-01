import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function useAxios(url) {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = (url) => {
        setIsLoading(true);

        axios
            .get(url)
            .then((res) => {
                setData(res.data);
            }).catch((err) => {
                setError(err.message || "Failed to Fetch Data");
            }).finally(() => {
                setIsLoading(false);
            })
    }

    useEffect(() => {
        fetchData(url);
    }, [url])


    return { data, isLoading, error }
}
