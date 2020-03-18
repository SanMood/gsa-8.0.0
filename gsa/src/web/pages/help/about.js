/* Copyright (C) 2017-2019 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import React from 'react';

import styled from 'styled-components';

import _ from 'gmp/locale';

import ErrorBoundary from 'web/components/errorboundary/errorboundary';

import HelpIcon from 'web/components/icon/helpicon';

import Img from 'web/components/img/img';

import ExternalLink from 'web/components/link/externallink';
import ProtocolDocLink from 'web/components/link/protocoldoclink';

import Layout from 'web/components/layout/layout';
import Section from 'web/components/section/section';

const StyledLayout = styled(Layout)`
  margin: 0 auto;
  max-width: 1100px;
`;

const DivP = styled.div`
  margin-bottom: 10px;
`;

const TextBlock = styled.div`
  max-width: 600px;
  min-width: 400px;
  margin-right: 30px;
  text-align: left;
  @media screen and (max-width: 800px) {
    margin-right: 0px;
  }
`;

const ImageBlock = styled.div`
  max-width: 400px;
`;

const About = () => (
  <ErrorBoundary errElement={_('page')}>
    <Layout flex="column">
      <Section img={<HelpIcon size="large" />} title={_('About GSA')}>
        <StyledLayout wrap align="center">
          <TextBlock>
            <h1>Greenbone安全助手</h1>
            <h3>版本 8.0+beta2</h3>
            <DivP>
              Greenbone安全助手（GSA）是Greenbone漏洞管理器（GVM）
              基于Web的用户界面。
            </DivP>
            <DivP>
              GSA通过Greenbone管理协议（GMP）连接到GVM，使GVM后端的丰富功能集可用，
              包括漏洞扫描、漏洞管理和相关活动。
            </DivP>
            <DivP>
              GSA 增加了各种智能功能，并形成了一个强大的工具
              来管理和维护IT基础架构的高弹性级别。
            </DivP>
            <DivP>
              版权所有 (C) 2017-2019 &nbsp;
              <a
                href="https://www.greenbone.net"
                target="_blank"
                rel="noopener noreferrer"
              >
                Greenbone Networks GmbH
              </a>
            </DivP>
            <DivP>
              翻译：三木
            </DivP>
            <DivP>
              许可证：GNU通用公共授权版本2及以上版本
              &nbsp;
              <ExternalLink to="http://www.gnu.org/licenses/old-licenses/gpl-2.0.html">
                （完整的授权内容）
              </ExternalLink>
            </DivP>
            <DivP>
              Cookies: 此Web应用程序使用Cookies存储会话信息。
              Cookie未存储在服务器端营盘山，也不会再任何地方提交。
              当会话关闭或过期时，它将丢失。Cookie也会临时存储在您的浏览器中，
              您可以在这里检查内容。
            </DivP>
            <DivP>
              GMP文件在{' '}
              <ProtocolDocLink title="这里" />提供。
            </DivP>
          </TextBlock>
          <ImageBlock>
            <Img src="gsa_splash.svg" alt="GSA" width="100%" />
          </ImageBlock>
        </StyledLayout>
      </Section>
    </Layout>
  </ErrorBoundary>
);

export default About;

// vim: set ts=2 sw=2 tw=80:
