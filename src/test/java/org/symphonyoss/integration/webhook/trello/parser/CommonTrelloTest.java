/**
 * Copyright 2016-2017 Symphony Integrations - Symphony LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.symphonyoss.integration.webhook.trello.parser;

import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

import com.symphony.api.pod.model.UserV2;

import com.fasterxml.jackson.databind.JsonNode;
import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Ignore;
import org.mockito.Mock;
import org.symphonyoss.integration.service.UserService;
import org.symphonyoss.integration.entity.model.User;
import org.symphonyoss.integration.json.JsonUtils;
import org.symphonyoss.integration.webhook.trello.model.TrelloMember;

import java.io.File;
import java.io.IOException;

/**
 * Helper class to trello unit tests.
 * Created by rsanchez on 28/09/16.
 */
@Ignore("not a test per se")
public class CommonTrelloTest {

  @Mock
  protected UserService userService;

  protected ClassLoader classLoader = getClass().getClassLoader();

  @Before
  public void init() {
    User user = new User();
    user.setUserName("ecarrenhosymphonytest");
    when(userService.getUserByUserName(anyString(), anyString())).thenReturn(user);
  }


  protected String readFile(String file) throws IOException {
    return FileUtils.readFileToString(new File(classLoader.getResource(file).getPath()))
        .replaceAll("\n", "");
  }

  protected JsonNode getJsonFile(String jsonFileName) throws IOException {
    return JsonUtils.readTree(classLoader.getResourceAsStream(jsonFileName));
  }

  protected UserV2 createUser(JsonNode node, Long userId) {
    TrelloMember member = new TrelloMember(node);

    String username = member.getUsername();

    UserV2 userV2 = new UserV2();
    userV2.setUsername(username);
    userV2.setEmailAddress(username + "@symphony.com");
    userV2.setId(userId);
    userV2.setDisplayName(member.getFullName());

    return userV2;
  }
}
