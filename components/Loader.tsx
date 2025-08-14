"use client";

import { CircularProgress } from "@mui/material";

export interface LoaderProps { isLoading: boolean }

export function ButtonLoader({ color = "white", size = 20 }: { color?: string, size?: number }) {
	return (<CircularProgress size={size} sx={{ color }} />);
}
