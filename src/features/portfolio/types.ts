import type { DISCORD_STATUS_LABEL } from "./data/portfolioData";
import type { Dispatch, SetStateAction } from "react";

export type PageId =
  | "home"
  | "about"
  | "projects"
  | "blog"
  | "blogdetail"
  | "contact";

export interface PageNavigationProps {
  page: PageId;
  setPage: Dispatch<SetStateAction<PageId>>;
}

export type DiscordStatus = keyof typeof DISCORD_STATUS_LABEL;

export interface DiscordPrimaryGuild {
  identity_guild_id: string;
  identity_enabled: boolean;
  tag: string | null;
  badge: string | null;
}

export interface DiscordUser {
  id: string;
  username: string;
  global_name?: string | null;
  display_name?: string | null;
  avatar?: string | null;
  discriminator?: string;
  banner?: string | null;
  banner_color?: string | null;
  accent_color?: number | null;
  primary_guild?: DiscordPrimaryGuild | null;
}

export interface DiscordActivityTimestamps {
  start?: number;
  end?: number;
}

export interface DiscordActivity {
  type: number;
  name?: string;
  state?: string;
  details?: string;
  timestamps?: DiscordActivityTimestamps;
}

export interface DiscordSpotifyTimestamps {
  start: number;
  end: number;
}

export interface DiscordSpotify {
  track_id: string;
  timestamps: DiscordSpotifyTimestamps;
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
}

export interface DiscordPresence {
  discord_user: DiscordUser;
  discord_status: DiscordStatus;
  activities: DiscordActivity[];
  active_on_discord_web?: boolean;
  active_on_discord_desktop?: boolean;
  active_on_discord_mobile?: boolean;
  listening_to_spotify?: boolean;
  spotify?: DiscordSpotify | null;
  kv?: Record<string, string>;
}

export interface LanyardResponse {
  success: boolean;
  data: DiscordPresence;
}
