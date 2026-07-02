import { useEffect, useState } from "react";
import {
  Gamepad2,
  Globe,
  Monitor,
  Music,
  Smartphone,
  Wifi,
} from "lucide-react";

import {
  DISCORD_FALLBACK,
  DISCORD_STATUS_LABEL,
  DISCORD_USER_ID,
} from "../data/portfolioData";
import type {
  DiscordPresence,
  DiscordStatus,
  LanyardResponse,
} from "../types";

const formatClock = (totalSeconds: number) => {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutesLabel = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secondsLabel = String(seconds % 60).padStart(2, "0");

  return `${minutesLabel}:${secondsLabel}`;
};

export function DiscordCard() {
  const [livePresence, setLivePresence] = useState<DiscordPresence | null>(null);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [badgeBroken, setBadgeBroken] = useState(false);

  useEffect(() => {
    let active = true;

    if (!DISCORD_USER_ID || DISCORD_USER_ID.startsWith("REPLACE_")) {
      return;
    }

    const loadPresence = () => {
      fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`)
        .then((response) => response.json())
        .then((response: LanyardResponse) => {
          if (active && response.success) {
            setLivePresence(response.data);
            setBadgeBroken(false);
          }
        })
        .catch(() => {
          // Keep the fallback profile on screen if the request fails.
        });
    };

    loadPresence();
    const pollTimer = window.setInterval(loadPresence, 30_000);

    return () => {
      active = false;
      window.clearInterval(pollTimer);
    };
  }, []);

  useEffect(() => {
    const clockTimer = window.setInterval(() => {
      setSessionElapsed((elapsed) => elapsed + 1);
      setNow(Date.now());
    }, 1_000);

    return () => window.clearInterval(clockTimer);
  }, []);

  const user = livePresence?.discord_user;
  const username = user?.username || DISCORD_FALLBACK.username;
  const displayName =
    user?.global_name || user?.display_name || DISCORD_FALLBACK.displayName;
  const statusKey: DiscordStatus =
    livePresence?.discord_status ||
    (DISCORD_FALLBACK.status as DiscordStatus);
  const statusLabel =
    DISCORD_STATUS_LABEL[statusKey] || DISCORD_STATUS_LABEL.online;
  const customStatus =
    livePresence?.activities?.find((activity) => activity.type === 4)?.state ||
    DISCORD_FALLBACK.customStatus;

  const spotify = livePresence?.listening_to_spotify
    ? livePresence.spotify
    : null;
  const activity = livePresence?.activities?.find(
    (item) => item.type !== 4 && item.type !== 2,
  );
  const activityName = spotify
    ? spotify.song
    : activity?.name || DISCORD_FALLBACK.activity;
  const activityDetail = spotify
    ? spotify.artist
    : activity?.details || activity?.state || DISCORD_FALLBACK.detail;

  const avatarUrl =
    user?.id && user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=128`
      : null;
  const guildTag = user?.primary_guild?.identity_enabled
    ? user.primary_guild.tag
    : null;
  const guildBadgeUrl =
    user?.primary_guild?.identity_enabled && user.primary_guild.badge
      ? `https://cdn.discordapp.com/guild-tag-badges/${user.primary_guild.identity_guild_id}/${user.primary_guild.badge}.png?size=32`
      : null;
  const displayGuildTag =
    guildTag || (!livePresence ? DISCORD_FALLBACK.guildTag : null);

  const platforms = {
    desktop: livePresence
      ? Boolean(livePresence.active_on_discord_desktop)
      : DISCORD_FALLBACK.platforms.desktop,
    mobile: livePresence
      ? Boolean(livePresence.active_on_discord_mobile)
      : DISCORD_FALLBACK.platforms.mobile,
    web: livePresence
      ? Boolean(livePresence.active_on_discord_web)
      : DISCORD_FALLBACK.platforms.web,
  };
  const hasPlatformSignal =
    platforms.desktop || platforms.mobile || platforms.web;

  let elapsedLabel = `SESSION ${formatClock(sessionElapsed)}`;
  let spotifyProgress: number | null = null;

  if (spotify?.timestamps?.start && spotify.timestamps.end) {
    const { start, end } = spotify.timestamps;
    const total = Math.max(1, end - start);
    const played = Math.min(total, Math.max(0, now - start));

    spotifyProgress = played / total;
    elapsedLabel = `${formatClock(played / 1000)} / ${formatClock(total / 1000)}`;
  } else if (activity?.timestamps?.start) {
    const elapsedSeconds = Math.max(
      0,
      (now - activity.timestamps.start) / 1000,
    );
    elapsedLabel = `ELAPSED ${formatClock(elapsedSeconds)}`;
  }

  return (
    <div className="discord-hud cursor-hover">
      <div className="discord-profile-row">
        <span className="discord-avatar cursor-hover">
          {avatarUrl ? (
            <img src={avatarUrl} alt={`${username} avatar`} />
          ) : (
            <span>{DISCORD_FALLBACK.avatarInitials}</span>
          )}
          <span className={`discord-status-dot status-${statusKey}`} />
        </span>
        <div className="discord-name-stack">
          <div className="discord-display-name-row">
            <div className="discord-display-name">{displayName}</div>
            {displayGuildTag && (
              <span className="discord-guild-tag">
                {guildBadgeUrl && !badgeBroken && (
                  <img
                    src={guildBadgeUrl}
                    alt=""
                    onError={() => setBadgeBroken(true)}
                  />
                )}
                {displayGuildTag}
              </span>
            )}
          </div>
          <div className="discord-username">@{username}</div>
        </div>
        <span className="discord-signal">
          <Wifi size={12} />
        </span>
      </div>

      <div className="discord-status-panel">
        <div>
          <span className="discord-mini-label">STATUS</span>
          <strong>{statusLabel}</strong>
        </div>
        <p>{customStatus}</p>
        {hasPlatformSignal && (
          <div className="discord-platform-row" aria-hidden="true">
            {platforms.desktop && (
              <span className="discord-platform-chip">
                <Monitor size={11} />
              </span>
            )}
            {platforms.mobile && (
              <span className="discord-platform-chip">
                <Smartphone size={11} />
              </span>
            )}
            {platforms.web && (
              <span className="discord-platform-chip">
                <Globe size={11} />
              </span>
            )}
          </div>
        )}
      </div>

      <div className="discord-activity-row">
        {spotify?.album_art_url ? (
          <span className="discord-activity-icon discord-activity-icon--art">
            <img src={spotify.album_art_url} alt="" />
          </span>
        ) : (
          <span className="discord-activity-icon">
            {spotify ? <Music size={14} /> : <Gamepad2 size={14} />}
          </span>
        )}
        <div className="discord-activity-copy">
          <span className="discord-mini-label">
            {spotify ? "SPOTIFY" : "ACTIVITY"}
          </span>
          <strong>{activityName}</strong>
          <small>{activityDetail}</small>
          {spotifyProgress !== null && (
            <span className="discord-progress-track">
              <span
                className="discord-progress-fill"
                style={{ width: `${spotifyProgress * 100}%` }}
              />
            </span>
          )}
        </div>
      </div>

      <div className="discord-footer">
        <div className="eq-bars" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <span className="discord-timer">{elapsedLabel}</span>
      </div>
    </div>
  );
}
