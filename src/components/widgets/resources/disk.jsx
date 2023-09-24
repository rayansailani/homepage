import _ from "lodash";
import useSWR from "swr";
import { FiHardDrive } from "react-icons/fi";
import { useTranslation } from "next-i18next";

import Resource from "../widget/resource";
import Error from "../widget/error";

export default function Disk({ options, expanded, refresh = 1500 }) {
  const { t } = useTranslation();

  const { data, error } = useSWR(`/api/widgets/resources?type=disk&target=${options.disk}`, {
    refreshInterval: refresh,
  });

  if (error || data?.error) {
    return <Error options={options} />
  }

  if (_.isEmpty(data)) {
    return <Resource
        icon={FiHardDrive}
        value="-"
        label={t("resources.free")}
        expandedValue="-"
        expandedLabel={t("resources.total")}
        expanded={expanded}
        percentage="0"
      />;
  }

  // data.drive.used not accurate?
  const percent = Math.round(((data.drive.size - data.drive.available) / data.drive.size) * 100);

  return <Resource
      icon={FiHardDrive}
      value={t("common.bytes", { value: data.drive.available })}
      label={t("resources.free")}
      expandedValue={t("common.bytes", { value: data.drive.size })}
      expandedLabel={t("resources.total")}
      percentage={percent}
      expanded={expanded}
    />;
}
