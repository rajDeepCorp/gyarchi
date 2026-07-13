import Link from "next/link";
import { CiFacebook, CiInstagram, CiLinkedin, CiYoutube, } from "react-icons/ci";
import { RiTwitterXLine } from "react-icons/ri";

type UserSocialLinksProps = {
    user: any;
};

export const UserSocialLinks = ({ user }: UserSocialLinksProps) => {

    const socialLinks = [
        { key: "facebook", icon: <CiFacebook />, href: user.facebook, },
        { key: "instagram", icon: <CiInstagram />, href: user.instagram, },
        { key: "twitter", icon: <RiTwitterXLine />, href: user.twitter, },
        { key: "linkedin", icon: <CiLinkedin />, href: user.linkedin, },
        { key: "youtube", icon: <CiYoutube />, href: user.youtube, },
    ].filter(({ href }) => href);

    return (

        <div className="w-full flex justify-start items-center gap-4 flex-wrap">
            {socialLinks.length > 0 ? (
                socialLinks.map(({ key, href, icon }) => (
                    <Link
                        key={key}
                        href={href!}
                        target="_blank"
                        className="relative text-2xl rounded-full shadow p-2 shadow-stone-500"
                    >
                        {icon}
                    </Link>
                ))
            ) : (
                null
            )}
        </div>

    );
};