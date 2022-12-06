import { useEffect, useState } from 'react';
import Members from 'data/members';
import Link from 'next/link';
import { MemberType } from '@interfaces/member.interface';

const MemberCard = ({ member }: { member: MemberType }) => {
  return (
    <Link href={member.linkedin} target="_blank">
      <div className="bg-gray-200 text-gray-900 shadow-md rounded-md m-2 p-5">
        <h3 className="text-xl">{member.name}</h3>
        <p>{member.registration_number}</p>
      </div>
    </Link>
  );
};

const MembersView = () => {
  const [members, setMembers] = useState<MemberType[]>([]);

  useEffect(() => {
    setMembers(Members);
  }, []);

  return (
    <div className="my-16 mt-7">
      <hr />

      <div className="text-3xl my-2">Members</div>

      <div className="flex flex-row flex-wrap gap-3 justify-center">
        {members.map((member, _idx) => {
          return (
            <MemberCard member={member} key={member.registration_number} />
          );
        })}
      </div>
    </div>
  );
};

export default MembersView;
